# Sistema de Recomendação por Imagens

Este projeto implementa um sistema de recomendação baseado em similaridade visual de imagens, utilizando embeddings extraídos de uma CNN pré-treinada (ResNet). O objetivo é indicar produtos visualmente semelhantes ao item consultado, considerando aparência (forma, cor, textura), não dados textuais.

O projeto foi desenvolvido em um único arquivo Python (`image_recommender.py`), com CLI completa e testes unitários, de integração e de aceitação embutidos.

## Requisitos

- Python 3.10+
- Dependências:
  - `torch`, `torchvision`, `pillow`, `numpy`, `python-dotenv`

Instalação rápida:

```
pip install torch torchvision pillow numpy python-dotenv
```

## Variáveis de ambiente

Crie um arquivo `.env` (opcional). Um exemplo está em `.env.example`:

```
IMAGE_DIR=images
INDEX_PATH=index.npz
MODEL_NAME=resnet50
DEVICE=cpu
```

## Uso

O arquivo único `image_recommender.py` expõe dois subcomandos:

- `index`: indexa um diretório de imagens, gera embeddings e salva em `index.npz`.
- `recommend`: gera recomendações para uma imagem de consulta usando o índice.

Ajuda:

```
python image_recommender.py --help
```

Indexação:

```
python image_recommender.py index --images ./data/produtos --out ./index.npz --device cpu --model resnet50
```

Recomendação:

```
python image_recommender.py recommend --index ./index.npz --query ./consulta.jpg --topk 5 --out recs.jsonl
```

Saída `recs.jsonl` (um JSON por linha):

```
{"path": "caminho/para/imagem1.jpg", "score": 0.87}
{"path": "caminho/para/imagem2.jpg", "score": 0.85}
...
```

## Uso via Notebook (Jupytext)

- Converter do script para notebook:

```
pip install jupytext nbformat
python -m jupytext --to ipynb image_recommender.py
```

- Abrir `image_recommender.ipynb` no Jupyter e executar as células para definir as funções.
- Exemplo de célula para indexação e recomendação:

```
# Se necessário, instale dependências dentro do notebook
%pip install torch torchvision pillow numpy python-dotenv

# Após executar as células de definição do sistema
E, paths = index_images("images", "index.npz", device="cpu", model_name="resnet50")
recs = recommend("index.npz", "consulta.jpg", topk=5)
recs
```

- Converter de volta para Python mantendo o conteúdo:

```
python -m jupytext --to py image_recommender.ipynb
```

- Opcional: manter pareamento entre `.py` e `.ipynb` (sincronização):

```
python -m jupytext --set-formats ipynb,py image_recommender.py
python -m jupytext --sync image_recommender.py
```

## Estrutura do Projeto

- `image_recommender.py`: código único do sistema (extração, indexação, busca e testes).
- `image_recommender.ipynb`: versão notebook gerada com Jupytext.
- `.env` e `.env.example`: configuração via variáveis de ambiente.
- `index.npz`: arquivo de índice gerado (embeddings e caminhos das imagens).
- `README.md`: documentação completa.

## Como funciona

- Extração de embeddings com ResNet pré-treinada em ImageNet.
- Normalização L2 das embeddings.
- Similaridade por cosseno entre a consulta e o índice.
- Retorna top-K itens com maior similaridade.

Caso não seja possível carregar pesos pré-treinados (ambiente offline), o sistema faz fallback para modelo sem pesos. A qualidade das recomendações pode ser afetada, mas o fluxo e os testes funcionam normalmente.

## Boas práticas e tratamento de erros

- Valida diretórios e arquivos antes de processar.
- Mensagens de erro estruturadas em JSON para facilitar logs.
- Evita travar em arquivos de imagem inválidos.

## Testes

Os testes estão embutidos no próprio arquivo e podem ser executados com:

```
python image_recommender.py --run-tests
```

Incluem:

- Unitários: verificação das dimensões das embeddings e construção do índice.
- Integração: fluxo de indexação + recomendação com imagens sintéticas.
- Aceitação: execução do CLI completo (index e recommend) via subprocesso.

## Preparação de dados

Organize suas imagens em um diretório, com qualquer estrutura de subpastas. Extensões suportadas: `.jpg`, `.jpeg`, `.png`, `.bmp`, `.webp`.

## Desempenho e dicas

- Para grandes volumes, considere executar com `DEVICE=cuda` se houver GPU disponível.
- O índice atual utiliza armazenamento em `npz` e busca por multiplicação de matrizes; para milhões de itens, considere FAISS/Annoy (fora do escopo deste desafio).

## Licença

Uso educacional no contexto do desafio de recomendação por imagens.