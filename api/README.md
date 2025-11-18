# Sistema de Recomendação de Imagens - Backend

Backend desenvolvido com FastAPI para o sistema de recomendação de imagens.

## 🚀 Funcionalidades

- **Upload de Imagens**: Processamento de imagens com validação de tipos e tamanhos
- **Extração de Features**: Geração de vetores de características visuais
- **Sistema de Recomendação**: Algoritmo de similaridade baseado em features
- **API RESTful**: Interface completa para frontend
- **Processamento Assíncrono**: Background tasks para processamento pesado

## 🛠️ Tecnologias Utilizadas

- **FastAPI** - Framework web moderno e rápido
- **Python 3.11** - Linguagem principal
- **PIL/Pillow** - Processamento de imagens
- **NumPy** - Computação numérica
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI

## 📦 Instalação

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

## 🚀 Execução

```bash
# Executar servidor de desenvolvimento
python main.py

# Ou usando uvicorn diretamente
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📋 API Endpoints

### Upload de Imagem
- **POST** `/api/images/upload` - Faz upload de nova imagem

### Gerenciamento de Imagens
- **GET** `/api/images` - Lista todas as imagens (com paginação)
- **GET** `/api/images/{id}` - Obtém detalhes de uma imagem
- **DELETE** `/api/images/{id}` - Remove uma imagem
- **POST** `/api/images/{id}/process` - Processa imagem manualmente

### Recomendações
- **GET** `/api/images/{id}/recommendations` - Obtém imagens similares

### Estatísticas
- **GET** `/api/stats` - Obtém estatísticas do sistema

## 🧪 Testes

```bash
# Executar testes
pytest test_main.py -v

# Com cobertura
pytest test_main.py --cov=. --cov-report=html
```

## 📊 Algoritmo de Recomendação

O sistema utiliza um algoritmo de similaridade coseno para encontrar imagens similares:

1. **Extração de Features**: Cada imagem é convertida em um vetor de 512 dimensões
2. **Similaridade Coseno**: Calcula a similaridade entre vetores
3. **Filtragem por Threshold**: Remove recomendações abaixo do limiar mínimo
4. **Ranking**: Ordena por similaridade decrescente

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `api/`:

```env
# Configurações do servidor
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Configurações de upload
MAX_FILE_SIZE=10485760  # 10MB em bytes
UPLOAD_DIR=uploads

# Configurações de processamento
FEATURE_VECTOR_SIZE=512
SIMILARITY_THRESHOLD=0.5
```

## 📁 Estrutura do Projeto

```
api/
├── main.py          # Aplicação principal FastAPI
├── requirements.txt # Dependências Python
└── test_main.py     # Testes unitários
```

## 🔍 Processamento de Imagens

O backend realiza as seguintes operações de processamento:

1. **Validação**: Verifica tipo e tamanho do arquivo
2. **Extração de Metadados**: Dimensões, formato, tamanho
3. **Análise de Cores**: Identifica cores dominantes
4. **Geração de Tags**: Cria tags descritivas automáticas
5. **Geração de Features**: Vetor numérico para similaridade

## ⚡ Performance

- **Upload**: Processamento assíncrono não bloqueia a API
- **Similaridade**: Algoritmo otimizado com NumPy
- **Cache**: Features são pré-calculadas e armazenadas
- **Paginação**: Listagens são paginadas para grandes conjuntos

## 🚀 Deploy

### Docker (Recomendado)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Deploy Manual

1. Configure o ambiente Python
2. Instale as dependências
3. Configure as variáveis de ambiente
4. Execute o servidor

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.