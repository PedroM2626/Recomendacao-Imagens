from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
from datetime import datetime
import json
from PIL import Image as PILImage
import numpy as np
from io import BytesIO
import base64

app = FastAPI(title="Sistema de Recomendação de Imagens", version="1.0.0")

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de dados
class Image(BaseModel):
    id: str
    filename: str
    original_name: str
    file_size: int
    mime_type: str
    width: int
    height: int
    url: str
    thumbnail_url: str
    features: Optional[List[float]] = None
    metadata: Optional[dict] = None
    created_at: str
    updated_at: str

class Recommendation(BaseModel):
    image: Image
    similarity_score: float
    explanation: str

class UploadResponse(BaseModel):
    success: bool
    data: dict

class RecommendationsResponse(BaseModel):
    success: bool
    data: dict

# Banco de dados em memória (simulação)
images_db = {}
feature_vectors = {}

# Funções auxiliares
def generate_mock_features() -> List[float]:
    """Gera um vetor de features mock para demonstração"""
    return np.random.randn(512).tolist()

def extract_dominant_colors(image_path: str) -> List[dict]:
    """Extrai cores dominantes da imagem"""
    try:
        with PILImage.open(image_path) as img:
            # Redimensionar para processamento mais rápido
            img = img.resize((150, 150))
            # Converter para RGB se necessário
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Obter pixels
            pixels = list(img.getdata())
            
            # Analisar cores (simplificado)
            colors = []
            for i, (r, g, b) in enumerate(pixels[:100]):  # Amostra de cores
                if i % 10 == 0:  # Pegar a cada 10 pixels
                    hex_color = f"#{r:02x}{g:02x}{b:02x}"
                    colors.append({
                        "hex": hex_color,
                        "percentage": np.random.uniform(0.1, 0.4),
                        "name": f"Cor {len(colors) + 1}"
                    })
            
            # Limitar a 5 cores principais
            return colors[:5]
    except Exception as e:
        print(f"Erro ao extrair cores: {e}")
        return []

def generate_tags() -> List[str]:
    """Gera tags automáticas para a imagem"""
    tags_pool = [
        "natureza", "paisagem", "urbano", "abstrato", "minimalista",
        "colorido", "monocromático", "vintage", "moderno", "artístico",
        "geométrico", "orgânico", "textura", "padrão", "contraste",
        "harmonia", "movimento", "estático", "vibrante", "sutil"
    ]
    return np.random.choice(tags_pool, size=np.random.randint(2, 6), replace=False).tolist()

def calculate_similarity(features1: List[float], features2: List[float]) -> float:
    """Calcula similaridade coseno entre dois vetores de features"""
    vec1 = np.array(features1)
    vec2 = np.array(features2)
    
    # Similaridade coseno
    similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    
    # Normalizar para 0-1
    return (similarity + 1) / 2

def generate_explanation(similarity: float, common_tags: List[str]) -> str:
    """Gera explicação para a recomendação"""
    if similarity > 0.8:
        explanation = "Muito similar"
    elif similarity > 0.6:
        explanation = "Similar"
    elif similarity > 0.4:
        explanation = "Parcialmente similar"
    else:
        explanation = "Pouco similar"
    
    if common_tags:
        explanation += f" - Compartilha tags: {', '.join(common_tags[:3])}"
    
    return explanation

# Rotas da API
@app.get("/")
async def root():
    return {"message": "Sistema de Recomendação de Imagens API", "version": "1.0.0"}

@app.post("/api/images/upload", response_model=UploadResponse)
async def upload_image(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...)
):
    """Faz upload de uma nova imagem"""
    try:
        # Validar tipo de arquivo
        valid_types = ["image/jpeg", "image/png", "image/webp"]
        if image.content_type not in valid_types:
            raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado")
        
        # Gerar ID único
        image_id = str(uuid.uuid4())
        
        # Ler conteúdo do arquivo
        contents = await image.read()
        
        # Salvar arquivo temporariamente
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_extension = os.path.splitext(image.filename)[1] if image.filename else ".jpg"
        filename = f"{image_id}{file_extension}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Obter informações da imagem
        with PILImage.open(file_path) as img:
            width, height = img.size
        
        # Criar objeto de imagem
        new_image = Image(
            id=image_id,
            filename=filename,
            original_name=image.filename or "imagem.jpg",
            file_size=len(contents),
            mime_type=image.content_type,
            width=width,
            height=height,
            url=f"/uploads/{filename}",
            thumbnail_url=f"/uploads/{filename}",  # Usar mesma imagem como thumbnail para demo
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat()
        )
        
        # Salvar no banco de dados
        images_db[image_id] = new_image
        
        # Processar em background
        background_tasks.add_task(process_image_background, image_id, file_path)
        
        return UploadResponse(
            success=True,
            data={
                "id": image_id,
                "filename": filename,
                "url": f"/uploads/{filename}",
                "processing_status": "pending"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload: {str(e)}")

async def process_image_background(image_id: str, file_path: str):
    """Processa a imagem em background"""
    try:
        # Gerar features mock
        features = generate_mock_features()
        feature_vectors[image_id] = features
        
        # Extrair cores dominantes
        dominant_colors = extract_dominant_colors(file_path)
        
        # Gerar tags
        tags = generate_tags()
        
        # Atualizar imagem com metadados
        if image_id in images_db:
            images_db[image_id].features = features
            images_db[image_id].metadata = {
                "colors": dominant_colors,
                "tags": tags,
                "description": f"Imagem com {len(dominant_colors)} cores dominantes",
                "confidence_score": np.random.uniform(0.7, 0.95)
            }
            images_db[image_id].updated_at = datetime.now().isoformat()
        
        print(f"Imagem {image_id} processada com sucesso")
        
    except Exception as e:
        print(f"Erro ao processar imagem {image_id}: {e}")

@app.get("/api/images")
async def get_images(limit: int = 20, page: int = 1):
    """Lista imagens com paginação"""
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    
    all_images = list(images_db.values())
    images = all_images[start_idx:end_idx]
    
    return {
        "images": [img.dict() for img in images],
        "total": len(all_images),
        "page": page,
        "limit": limit
    }

@app.get("/api/images/{image_id}")
async def get_image(image_id: str):
    """Obtém detalhes de uma imagem específica"""
    if image_id not in images_db:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    
    return images_db[image_id].dict()

@app.get("/api/images/{image_id}/recommendations")
async def get_recommendations(image_id: str, limit: int = 10, threshold: float = 0.5):
    """Obtém recomendações para uma imagem"""
    if image_id not in images_db:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    
    source_image = images_db[image_id]
    
    if not source_image.features:
        return {
            "success": True,
            "data": {
                "recommendations": [],
                "processing_time_ms": 0,
                "message": "Imagem ainda está sendo processada"
            }
        }
    
    start_time = datetime.now()
    
    # Calcular similaridades com outras imagens
    recommendations = []
    source_features = source_image.features
    
    for other_id, other_image in images_db.items():
        if other_id == image_id or not other_image.features:
            continue
        
        similarity = calculate_similarity(source_features, other_image.features)
        
        if similarity >= threshold:
            # Encontrar tags em comum
            source_tags = set(source_image.metadata.get("tags", []) if source_image.metadata else [])
            other_tags = set(other_image.metadata.get("tags", []) if other_image.metadata else [])
            common_tags = list(source_tags.intersection(other_tags))
            
            explanation = generate_explanation(similarity, common_tags)
            
            recommendation = Recommendation(
                image=other_image,
                similarity_score=similarity,
                explanation=explanation
            )
            
            recommendations.append(recommendation)
    
    # Ordenar por similaridade
    recommendations.sort(key=lambda x: x.similarity_score, reverse=True)
    
    # Limitar resultados
    recommendations = recommendations[:limit]
    
    processing_time = (datetime.now() - start_time).total_seconds() * 1000
    
    return {
        "success": True,
        "data": {
            "recommendations": [rec.dict() for rec in recommendations],
            "processing_time_ms": processing_time
        }
    }

@app.post("/api/images/{image_id}/process")
async def process_image(image_id: str):
    """Processa uma imagem manualmente"""
    if image_id not in images_db:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    
    image = images_db[image_id]
    file_path = f"uploads/{image.filename}"
    
    if os.path.exists(file_path):
        await process_image_background(image_id, file_path)
        return {"message": "Processamento iniciado"}
    else:
        raise HTTPException(status_code=404, detail="Arquivo de imagem não encontrado")

@app.get("/api/stats")
async def get_stats():
    """Obtém estatísticas do sistema"""
    total_images = len(images_db)
    processed_images = sum(1 for img in images_db.values() if img.features is not None)
    
    # Calcular tempo médio de processamento (mock)
    avg_processing_time = 2.5 if processed_images > 0 else 0
    
    # Estatísticas de tags
    all_tags = []
    for img in images_db.values():
        if img.metadata and img.metadata.get("tags"):
            all_tags.extend(img.metadata["tags"])
    
    from collections import Counter
    tag_counts = Counter(all_tags)
    top_tags = [{"tag": tag, "count": count} for tag, count in tag_counts.most_common(10)]
    
    return {
        "total_images": total_images,
        "processed_images": processed_images,
        "average_processing_time": avg_processing_time,
        "top_tags": top_tags,
        "storage_usage": sum(img.file_size for img in images_db.values())
    }

if __name__ == "__main__":
    import uvicorn
    
    # Criar diretório de uploads se não existir
    os.makedirs("uploads", exist_ok=True)
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)