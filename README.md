# Sistema de Recomendação de Imagens

Sistema completo de recomendação de imagens com inteligência artificial, desenvolvido com React (frontend) e FastAPI (backend).

## 🚀 Funcionalidades

### Frontend (React + TypeScript)
- **Interface Moderna**: Design responsivo com Tailwind CSS
- **Upload Intuitivo**: Drag & drop com preview em tempo real
- **Galeria de Imagens**: Visualização em grid com busca e filtros
- **Sistema de Recomendações**: Visualização detalhada de imagens similares
- **Processamento em Tempo Real**: Feedback visual durante upload e análise

### Backend (FastAPI + Python)
- **API RESTful**: Endpoints completos para gerenciamento de imagens
- **Processamento de Imagens**: Extração de features, cores dominantes e tags
- **Sistema de Recomendação**: Algoritmo de similaridade com vetores de features
- **Armazenamento**: Sistema de uploads com organização por ID

## 📁 Estrutura do Projeto

```
Recomendacao-Imagens/
├── src/                    # Frontend React
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/            # Páginas principais
│   ├── services/         # Serviços de API
│   ├── stores/           # Estado global (Zustand)
│   ├── types/            # Definições TypeScript
│   └── lib/              # Utilitários
├── api/                   # Backend FastAPI
│   ├── main.py           # Aplicação principal
│   ├── requirements.txt  # Dependências Python
│   └── test_main.py      # Testes unitários
├── .trae/documents/      # Documentação do projeto
│   ├── product.md        # Requisitos do produto
│   └── architecture.md   # Arquitetura técnica
└── uploads/              # Diretório de uploads (criado automaticamente)
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Vite** - Build tool rápido
- **Zustand** - Gerenciamento de estado
- **React Router** - Navegação
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações/toasts

### Backend
- **FastAPI** - Framework web moderno e rápido
- **Python 3.11** - Linguagem principal
- **PIL/Pillow** - Processamento de imagens
- **NumPy** - Computação numérica
- **Pydantic** - Validação de dados

## 📦 Instalação e Execução

### Frontend

```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Executar testes
pnpm run test
```

### Backend

```bash
# Navegar para pasta do backend
cd api

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar servidor
python main.py

# Executar testes
pytest test_main.py -v
```

## 🌟 Páginas Principais

1. **HomePage** (`/`) - Landing page com informações e call-to-action
2. **UploadPage** (`/upload`) - Interface de upload de imagens com drag & drop
3. **GalleryPage** (`/gallery`) - Galeria com todas as imagens, busca e filtros
4. **RecommendationsPage** (`/recommendations/:id`) - Visualização de imagens similares

## 🔧 Configuração

### Frontend - Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
```

### Backend - Variáveis de Ambiente

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

## 🎯 Como Usar

### 1. Acessar o Sistema
- Abra o navegador e acesse `http://localhost:5173` (ou a porta indicada pelo Vite)

### 2. Fazer Upload de Imagem
- Clique em "Começar Agora" ou vá para `/upload`
- Arraste e solte uma imagem ou clique para selecionar
- Visualize o preview e confirme o upload

### 3. Explorar Recomendações
- Após o upload, você será redirecionado automaticamente para as recomendações
- Visualize imagens similares com porcentagem de similaridade
- Clique em qualquer imagem para ver detalhes

### 4. Navegar pela Galeria
- Acesse `/gallery` para ver todas as imagens
- Use a busca e filtros para encontrar imagens específicas
- Clique em qualquer imagem para ver recomendações

## 🧪 Testes

### Frontend
```bash
# Executar todos os testes
pnpm run test

# Executar testes com cobertura
pnpm run test:coverage
```

### Backend
```bash
# Executar testes do backend
cd api
pytest test_main.py -v

# Com cobertura
pytest test_main.py --cov=. --cov-report=html
```

## 🚀 Deploy

### Frontend (Vercel/Recomendado)
```bash
# Build de produção
pnpm run build

# O diretório 'dist' pode ser deployado em:
# - Vercel (recomendado)
# - Netlify
# - GitHub Pages
# - Qualquer serviço de CDN
```

### Backend (Docker/Recomendado)
```bash
# Criar imagem Docker
docker build -t image-recommender-api .

# Executar container
docker run -p 8000:8000 image-recommender-api
```

## 📋 Próximos Passos e Melhorias

### Funcionalidades Planejadas
- [ ] **Autenticação de Usuários**: Sistema de login/registro
- [ ] **Favoritos**: Permitir salvar imagens favoritas
- [ ] **Dashboard Administrativo**: Painel de controle com estatísticas
- [ ] **Integração com IA Real**: Substituir mocks por modelos reais (CLIP, etc.)
- [ ] **Filtros Avançados**: Mais opções de filtragem e busca
- [ ] **Compartilhamento**: Links públicos para imagens e recomendações
- [ ] **Exportação**: Download de relatórios e coleções

### Melhorias Técnicas
- [ ] **Cache Redis**: Implementar cache para melhorar performance
- [ ] **Banco de Dados Real**: Migrar de memória para PostgreSQL
- [ ] **Processamento Assíncrono**: Implementar Celery para tarefas pesadas
- [ ] **Testes de Integração**: Adicionar testes E2E com Cypress
- [ ] **CI/CD**: Configurar pipelines de deploy automático
- [ ] **Monitoramento**: Adicionar logs e métricas de performance

## 🎨 Design e UX

### Paleta de Cores
- **Primária**: Azul tecnológico (#2563EB)
- **Secundária**: Cinza claro (#F3F4F6) e cinza escuro (#6B7280)
- **Fundo**: Branco (#FFFFFF) e escuro (#1F2937)

### Tipografia
- **Fonte Principal**: Inter/Roboto (sans-serif moderna)
- **Hierarquia**: Tamanhos claros e consistentes

### Componentes
- **Cards**: Com sombras sutis e efeitos hover
- **Botões**: Estilo moderno com bordas arredondadas
- **Formulários**: Validação em tempo real e feedback visual

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas e suporte:
- Crie uma issue no GitHub
- Verifique a documentação em `.trae/documents/`
- Consulte os arquivos README específicos de cada parte do sistema

---

**Desenvolvido com ❤️ e tecnologia moderna**
