## 1. Arquitetura do Sistema

```mermaid
graph TD
    A[User Browser] --> B[React Frontend]
    B --> C[FastAPI Backend]
    C --> D[Supabase Database]
    C --> E[Redis Cache]
    C --> F[Python ML Service]
    F --> G[OpenAI CLIP API]
    
    subgraph "Frontend Layer"
        B
    end
    
    subgraph "Backend Layer"
        C
        F
    end
    
    subgraph "Data Layer"
        D
        E
    end
    
    subgraph "External Services"
        G
    end
```

## 2. Descrição das Tecnologias

### Frontend
- **React 18**: Framework principal para construção da interface
- **TypeScript 5**: Tipagem estática para maior segurança e manutenibilidade
- **Vite**: Build tool rápido e moderno para desenvolvimento
- **Tailwind CSS 3**: Framework CSS utilitário para estilização responsiva
- **React Query**: Gerenciamento de estado servidor e cache de dados
- **React Hook Form**: Gerenciamento eficiente de formulários
- **Axios**: Cliente HTTP para comunicação com backend

### Backend
- **FastAPI**: Framework Python de alta performance para APIs REST
- **Python 3.11**: Linguagem principal do backend com suporte a async/await
- **SQLAlchemy**: ORM para interação com banco de dados
- **Pydantic**: Validação de dados e serialização
- **Celery**: Processamento assíncrono de tarefas pesadas
- **Redis**: Cache distribuído e broker de mensagens
- **OpenAI CLIP**: Modelo de IA para extração de features visuais

### Infraestrutura
- **Supabase**: Backend-as-a-service com PostgreSQL, autenticação e storage
- **Docker**: Containerização para deploy consistente
- **Nginx**: Reverse proxy e serviço de arquivos estáticos

## 3. Definições de Rotas

### Rotas do Frontend (React Router)
| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | HomePage | Página inicial com call-to-action |
| `/upload` | UploadPage | Interface de upload de imagens |
| `/gallery` | GalleryPage | Galeria com todas as imagens |
| `/recommendations/:imageId` | RecommendationsPage | Página de recomendações para imagem específica |
| `/dashboard` | DashboardPage | Dashboard administrativo |
| `/login` | LoginPage | Página de autenticação |

### Rotas da API (FastAPI)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/images/upload` | Upload de nova imagem |
| GET | `/api/images` | Listar imagens com paginação |
| GET | `/api/images/{image_id}` | Obter detalhes de imagem específica |
| DELETE | `/api/images/{image_id}` | Remover imagem |
| GET | `/api/images/{image_id}/recommendations` | Obter recomendações para imagem |
| POST | `/api/images/{image_id}/process` | Processar imagem e extrair features |
| GET | `/api/stats` | Obter estatísticas do sistema |

## 4. Definições de API

### 4.1 Tipos de Dados Principais

```typescript
// Imagem
interface Image {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
  url: string;
  thumbnail_url: string;
  features: number[]; // Vetor de features CLIP
  metadata: ImageMetadata;
  created_at: string;
  updated_at: string;
}

// Metadados da Imagem
interface ImageMetadata {
  colors: ColorInfo[];
  tags: string[];
  description?: string;
  confidence_score: number;
}

// Informações de Cor
interface ColorInfo {
  hex: string;
  percentage: number;
  name: string;
}

// Recomendação
interface Recommendation {
  image: Image;
  similarity_score: number;
  explanation: string;
}

// Estatísticas
interface SystemStats {
  total_images: number;
  total_users: number;
  average_processing_time: number;
  top_tags: { tag: string; count: number }[];
  storage_usage: number;
}
```

### 4.2 Endpoints Detalhados

#### Upload de Imagem
```
POST /api/images/upload
```

Request:
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| image | File | Sim | Arquivo de imagem (max 10MB) |
| metadata | JSON | Não | Metadados adicionais |

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "processed_123.jpg",
    "url": "https://storage.supabase.co/images/uuid.jpg",
    "processing_status": "pending"
  }
}
```

#### Obter Recomendações
```
GET /api/images/{image_id}/recommendations?limit=10&threshold=0.7
```

Query Parameters:
| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| limit | number | 10 | Número máximo de recomendações |
| threshold | number | 0.7 | Limiar mínimo de similaridade (0-1) |

Response:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "image": { "id": "uuid-2", "url": "..." },
        "similarity_score": 0.85,
        "explanation": "Similaridade baseada em cores e composição"
      }
    ],
    "processing_time_ms": 250
  }
}
```

## 5. Arquitetura do Servidor

```mermaid
graph TD
    A[Client Request] --> B[FastAPI Router]
    B --> C[Authentication Middleware]
    C --> D[Controller Layer]
    D --> E[Service Layer]
    E --> F[Repository Layer]
    F --> G[Supabase Database]
    E --> H[ML Service]
    H --> I[CLIP Model]
    
    subgraph "API Layer"
        B
        C
    end
    
    subgraph "Business Logic"
        D
        E
    end
    
    subgraph "Data Access"
        F
    end
    
    subgraph "ML Processing"
        H
        I
    end
```

### Camadas de Arquitetura

**Controller Layer**: Responsável por validar requisições, autenticação e formatação de respostas
**Service Layer**: Contém a lógica de negócios, processamento de imagens e cálculo de similaridades
**Repository Layer**: Abstração para acesso a dados, queries otimizadas e transações
**ML Service**: Serviço dedicado para processamento de IA, extração de features e cálculos vetoriais

## 6. Modelo de Dados

### 6.1 Diagrama ER

```mermaid
erDiagram
    USERS ||--o{ IMAGES : uploads
    USERS ||--o{ RECOMMENDATIONS : receives
    IMAGES ||--o{ RECOMMENDATIONS : source
    IMAGES ||--o{ IMAGE_FEATURES : contains
    IMAGES ||--o{ IMAGE_TAGS : has
    IMAGES ||--o{ USER_FAVORITES : favorited_by
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        string role
        timestamp created_at
        timestamp last_login
    }
    
    IMAGES {
        uuid id PK
        uuid user_id FK
        string filename
        string original_name
        integer file_size
        string mime_type
        integer width
        integer height
        string storage_url
        string thumbnail_url
        json metadata
        timestamp created_at
        timestamp processed_at
    }
    
    IMAGE_FEATURES {
        uuid id PK
        uuid image_id FK
        uuid feature_vector_id FK
        decimal confidence_score
        timestamp created_at
    }
    
    FEATURE_VECTORS {
        uuid id PK
        decimal[] vector_data
        string model_version
        timestamp created_at
    }
    
    RECOMMENDATIONS {
        uuid id PK
        uuid source_image_id FK
        uuid recommended_image_id FK
        decimal similarity_score
        json explanation
        timestamp created_at
    }
    
    IMAGE_TAGS {
        uuid id PK
        uuid image_id FK
        string tag_name
        decimal confidence
        timestamp created_at
    }
    
    USER_FAVORITES {
        uuid id PK
        uuid user_id FK
        uuid image_id FK
        timestamp created_at
    }
```

### 6.2 Definições DDL

```sql
-- Tabela de Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Imagens
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size > 0),
    mime_type VARCHAR(50) NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
    width INTEGER NOT NULL CHECK (width > 0),
    height INTEGER NOT NULL CHECK (height > 0),
    storage_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Vetores de Features (para similaridade)
CREATE TABLE feature_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID REFERENCES images(id) ON DELETE CASCADE,
    vector_data vector(512), -- Vetor CLIP de 512 dimensões
    model_version VARCHAR(20) DEFAULT 'clip-vit-base-patch32',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Recomendações
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_image_id UUID REFERENCES images(id) ON DELETE CASCADE,
    recommended_image_id UUID REFERENCES images(id) ON DELETE CASCADE,
    similarity_score DECIMAL(3,2) NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 1),
    explanation JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_image_id, recommended_image_id)
);

-- Tabela de Tags
CREATE TABLE image_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID REFERENCES images(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_created_at ON images(created_at DESC);
CREATE INDEX idx_images_processing_status ON images(processing_status);
CREATE INDEX idx_feature_vectors_image_id ON feature_vectors(image_id);
CREATE INDEX idx_recommendations_source_image ON recommendations(source_image_id);
CREATE INDEX idx_recommendations_score ON recommendations(similarity_score DESC);
CREATE INDEX idx_image_tags_image_id ON image_tags(image_id);
CREATE INDEX idx_image_tags_tag_name ON image_tags(tag_name);

-- Permissões Supabase
GRANT SELECT ON users TO anon;
GRANT SELECT ON images TO anon;
GRANT SELECT ON recommendations TO anon;
GRANT SELECT ON image_tags TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT ALL PRIVILEGES ON images TO authenticated;
GRANT ALL PRIVILEGES ON feature_vectors TO authenticated;
GRANT ALL PRIVILEGES ON recommendations TO authenticated;
GRANT ALL PRIVILEGES ON image_tags TO authenticated;
```

## 7. Fluxo de Processamento de Imagens

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Storage
    participant MLService
    participant Database
    
    User->>Frontend: Seleciona imagem
    Frontend->>API: POST /api/images/upload
    API->>Storage: Upload para Supabase Storage
    API->>Database: Criar registro de imagem
    API->>MLService: Processar imagem (Celery)
    MLService->>MLService: Extrair features CLIP
    MLService->>MLService: Gerar thumbnail
    MLService->>MLService: Detectar cores dominantes
    MLService->>MLService: Gerar tags automáticas
    MLService->>Database: Salvar features e metadata
    MLService->>Database: Atualizar status para 'completed'
    API->>Frontend: Resposta com ID da imagem
    Frontend->>API: GET /api/images/{id}/recommendations
    API->>Database: Buscar imagens similares (similaridade vetorial)
    Database->>API: Retornar imagens ordenadas por similaridade
    API->>Frontend: Lista de recomendações
```

## 8. Configurações de Deploy

### Variáveis de Ambiente
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/imagedb
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_BUCKET_NAME=images
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your-openai-key
SECRET_KEY=your-secret-key
CELERY_BROKER_URL=redis://localhost:6379
CELERY_RESULT_BACKEND=redis://localhost:6379
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8000
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/imagedb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  celery:
    build: ./backend
    command: celery -A app.celery worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/imagedb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=imagedb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```