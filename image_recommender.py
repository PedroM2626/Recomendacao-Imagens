import os
import sys
import argparse
import json
import time
import tempfile
import shutil
from typing import List, Tuple
import numpy as np
from PIL import Image
import subprocess

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

import torch
import torchvision.transforms as T
from torchvision import models


class Timer:
    def __init__(self):
        self.t = time.time()
    def tick(self) -> float:
        now = time.time()
        d = now - self.t
        self.t = now
        return d


SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def list_images(root: str) -> List[str]:
    if not os.path.isdir(root):
        raise FileNotFoundError(f"Diretório não encontrado: {root}")
    out = []
    for base, _, files in os.walk(root):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in SUPPORTED_EXTS:
                out.append(os.path.join(base, f))
    if not out:
        raise RuntimeError("Nenhuma imagem suportada foi encontrada")
    return sorted(out)


def _default_transforms() -> T.Compose:
    return T.Compose([
        T.Resize(256),
        T.CenterCrop(224),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])


class ImageEmbedder:
    def __init__(self, device: str = "cpu", model_name: str = "resnet50"):
        self.device = torch.device(device if torch.cuda.is_available() or device == "cpu" else "cpu")
        self.model_name = model_name
        self.model, self.transform = self._load_model_and_transform()
        self.model.eval()
        self.model.to(self.device)

    def _load_model_and_transform(self):
        weights = None
        transform = None
        model = None
        try:
            if self.model_name == "resnet50":
                weights = models.ResNet50_Weights.IMAGENET1K_V2
                model = models.resnet50(weights=weights)
                transform = weights.transforms()
            elif self.model_name == "resnet18":
                weights = models.ResNet18_Weights.IMAGENET1K_V1
                model = models.resnet18(weights=weights)
                transform = weights.transforms()
            else:
                weights = models.ResNet50_Weights.IMAGENET1K_V2
                model = models.resnet50(weights=weights)
                transform = weights.transforms()
        except Exception:
            if self.model_name == "resnet18":
                model = models.resnet18(weights=None)
            else:
                model = models.resnet50(weights=None)
            transform = _default_transforms()
        backbone = torch.nn.Sequential(*list(model.children())[:-1])
        return backbone, transform

    def embed(self, image_path: str) -> np.ndarray:
        if not os.path.isfile(image_path):
            raise FileNotFoundError(f"Arquivo não encontrado: {image_path}")
        try:
            img = Image.open(image_path).convert("RGB")
        except Exception as e:
            raise RuntimeError(f"Falha ao abrir imagem: {image_path}: {str(e)}")
        with torch.inference_mode():
            x = self.transform(img).unsqueeze(0).to(self.device)
            feat = self.model(x)
            feat = feat.view(feat.size(0), -1)
            v = feat[0].detach().cpu().numpy().astype(np.float32)
        return v


def save_index(embeddings: np.ndarray, paths: List[str], out_path: str):
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    np.savez_compressed(out_path, embeddings=embeddings, paths=np.array(paths))


def load_index(index_path: str) -> Tuple[np.ndarray, List[str]]:
    if not os.path.isfile(index_path):
        raise FileNotFoundError(f"Índice não encontrado: {index_path}")
    z = np.load(index_path, allow_pickle=True)
    emb = z["embeddings"].astype(np.float32)
    paths = list(z["paths"].tolist())
    if emb.ndim != 2 or len(paths) != emb.shape[0]:
        raise RuntimeError("Índice inválido")
    return emb, paths


def normalize_rows(mat: np.ndarray) -> np.ndarray:
    n = np.linalg.norm(mat, axis=1, keepdims=True)
    n[n == 0] = 1.0
    return mat / n


def index_images(image_dir: str, out_path: str, device: str = "cpu", model_name: str = "resnet50", batch_size: int = 1) -> Tuple[np.ndarray, List[str]]:
    timer = Timer()
    paths = list_images(image_dir)
    embeder = ImageEmbedder(device=device, model_name=model_name)
    vecs = []
    for p in paths:
        try:
            v = embeder.embed(p)
            vecs.append(v)
        except Exception as e:
            print(json.dumps({"erro": str(e), "arquivo": p}))
    if not vecs:
        raise RuntimeError("Nenhuma embedding foi gerada")
    E = np.vstack(vecs)
    E = normalize_rows(E)
    save_index(E, paths[:E.shape[0]], out_path)
    print(json.dumps({"tempo_segundos": round(timer.tick(), 3), "imagens_indexadas": E.shape[0], "dim": int(E.shape[1])}))
    return E, paths[:E.shape[0]]


def recommend(index_path: str, query_image: str, topk: int = 5, device: str = "cpu", model_name: str = "resnet50") -> List[Tuple[str, float]]:
    emb, paths = load_index(index_path)
    emb = normalize_rows(emb)
    embeder = ImageEmbedder(device=device, model_name=model_name)
    q = embeder.embed(query_image)
    q = q.astype(np.float32)
    qn = q / (np.linalg.norm(q) + 1e-12)
    scores = emb.dot(qn)
    idx = np.argsort(-scores)[:max(1, topk)]
    return [(paths[i], float(scores[i])) for i in idx]


def write_jsonl(items: List[Tuple[str, float]], out_path: str):
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        for p, s in items:
            f.write(json.dumps({"path": p, "score": round(s, 6)}) + "\n")


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="image_recommender", description="Sistema de recomendação por imagens baseado em embeddings de CNN")
    sub = parser.add_subparsers(dest="cmd", required=False)

    p_index = sub.add_parser("index", help="Indexa diretório de imagens")
    p_index.add_argument("--images", required=False, default=os.getenv("IMAGE_DIR", "images"))
    p_index.add_argument("--out", required=False, default=os.getenv("INDEX_PATH", "index.npz"))
    p_index.add_argument("--device", required=False, default=os.getenv("DEVICE", "cpu"))
    p_index.add_argument("--model", required=False, default=os.getenv("MODEL_NAME", "resnet50"))

    p_rec = sub.add_parser("recommend", help="Gera recomendações para uma imagem de consulta")
    p_rec.add_argument("--index", required=False, default=os.getenv("INDEX_PATH", "index.npz"))
    p_rec.add_argument("--query", required=True)
    p_rec.add_argument("--topk", type=int, required=False, default=5)
    p_rec.add_argument("--out", required=False, default="recommendations.jsonl")
    p_rec.add_argument("--device", required=False, default=os.getenv("DEVICE", "cpu"))
    p_rec.add_argument("--model", required=False, default=os.getenv("MODEL_NAME", "resnet50"))

    parser.add_argument("--run-tests", action="store_true", help="Executa testes unitários, integração e aceitação")
    return parser


def _create_dummy_images(root: str) -> List[str]:
    os.makedirs(root, exist_ok=True)
    paths = []
    rng = np.random.default_rng(42)
    colors = [(220, 20, 60), (65, 105, 225), (34, 139, 34), (255, 165, 0), (128, 0, 128)]
    for i, c in enumerate(colors):
        img = Image.new("RGB", (256, 256), c)
        arr = np.array(img)
        noise = rng.integers(0, 20, size=arr.shape, dtype=np.uint8)
        arr = np.clip(arr + noise, 0, 255)
        img = Image.fromarray(arr)
        p = os.path.join(root, f"dummy_{i}.jpg")
        img.save(p)
        paths.append(p)
    return paths


def run_unit_tests() -> List[str]:
    results = []
    tmp = tempfile.mkdtemp(prefix="recommender_unit_")
    try:
        images = _create_dummy_images(tmp)
        embeder = ImageEmbedder(device="cpu", model_name=os.getenv("MODEL_NAME", "resnet50"))
        v = embeder.embed(images[0])
        assert isinstance(v, np.ndarray)
        assert v.ndim == 1
        assert v.size >= 256
        results.append("unit_embeddings_shape_ok")
        E, paths = index_images(tmp, os.path.join(tmp, "index.npz"), device="cpu", model_name=os.getenv("MODEL_NAME", "resnet50"))
        assert E.shape[0] == len(paths)
        assert E.ndim == 2
        results.append("unit_index_build_ok")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return results


def run_integration_tests() -> List[str]:
    results = []
    tmp = tempfile.mkdtemp(prefix="recommender_integ_")
    try:
        images = _create_dummy_images(tmp)
        idx_path = os.path.join(tmp, "index.npz")
        index_images(tmp, idx_path, device="cpu", model_name=os.getenv("MODEL_NAME", "resnet50"))
        recs = recommend(idx_path, images[0], topk=3, device="cpu", model_name=os.getenv("MODEL_NAME", "resnet50"))
        assert len(recs) == 3
        assert isinstance(recs[0][0], str) and isinstance(recs[0][1], float)
        results.append("integration_recommendations_ok")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return results


def run_acceptance_tests() -> List[str]:
    results = []
    tmp = tempfile.mkdtemp(prefix="recommender_accept_")
    try:
        images = _create_dummy_images(tmp)
        idx_path = os.path.join(tmp, "index.npz")
        cmd_index = [sys.executable, os.path.abspath(__file__), "index", "--images", tmp, "--out", idx_path]
        p1 = subprocess.Popen(cmd_index, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out1, err1 = p1.communicate()
        if p1.returncode != 0:
            raise RuntimeError(f"Falha CLI index: {err1.decode('utf-8', 'ignore')}")
        cmd_rec = [sys.executable, os.path.abspath(__file__), "recommend", "--index", idx_path, "--query", images[0], "--topk", "2", "--out", os.path.join(tmp, "recs.jsonl")]
        p2 = subprocess.Popen(cmd_rec, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out2, err2 = p2.communicate()
        if p2.returncode != 0:
            raise RuntimeError(f"Falha CLI recommend: {err2.decode('utf-8', 'ignore')}")
        results.append("acceptance_cli_flow_ok")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return results


def main():
    parser = make_parser()
    args = parser.parse_args()
    if args.run_tests:
        all_results = []
        try:
            all_results.extend(run_unit_tests())
            all_results.extend(run_integration_tests())
            all_results.extend(run_acceptance_tests())
        except Exception as e:
            print(json.dumps({"tests": "failed", "erro": str(e)}))
            sys.exit(1)
        print(json.dumps({"tests": "passed", "results": all_results}))
        return
    if not args.cmd:
        parser.print_help()
        sys.exit(0)
    if args.cmd == "index":
        try:
            index_images(args.images, args.out, device=args.device, model_name=args.model)
        except Exception as e:
            print(json.dumps({"erro": str(e)}))
            sys.exit(1)
    elif args.cmd == "recommend":
        try:
            items = recommend(args.index, args.query, topk=int(args.topk), device=args.device, model_name=args.model)
            write_jsonl(items, args.out)
            print(json.dumps({"recomendacoes": len(items), "saida": args.out}))
        except Exception as e:
            print(json.dumps({"erro": str(e)}))
            sys.exit(1)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()