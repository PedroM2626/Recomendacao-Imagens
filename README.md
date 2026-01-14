# Sistema de Recomendação de Imagens

> 🎯 **FOCO DO PROJETO**: O núcleo funcional deste projeto reside no script Python [image_recommender.py](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.py) e no notebook [image_recommender.ipynb](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.ipynb).

> ⚠️ **EM DESENVOLVIMENTO**: A interface web (Frontend React + Backend FastAPI) está em fase inicial de desenvolvimento e ainda não é o foco principal de uso imediato.

Sistema de recomendação de imagens baseado em inteligência artificial (CNN/ResNet) para extração de características e busca por similaridade.

## 🚀 Funcionalidades

### 🐍 Núcleo Python (Foco Principal)
- ✅ **Extração de Embeddings**: Uso de modelos pré-treinados (ResNet50/ResNet18) via PyTorch.
- ✅ **Busca por Similaridade**: Algoritmo de busca rápida usando similaridade de cosseno.
- ✅ **CLI Completa**: Script [image_recommender.py](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.py) para indexação e recomendação via linha de comando.
- ✅ **Notebook Interativo**: [image_recommender.ipynb](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.ipynb) totalmente comentado e pronto para uso.
- ✅ **Testes Automatizados**: Suíte de testes unitários, integração e aceitação inclusos no script.

### 🌐 Interface Web (Em Desenvolvimento)
- ⚠️ **Frontend (React)**: Estrutura inicial e componentes básicos (ainda não integrados).
- ⚠️ **Backend (FastAPI)**: API RESTful para servir as recomendações (em fase de implementação).

## 📁 Estrutura do Projeto

```
Recomendacao-Imagens/
├── image_recommender.py    # Script principal (CLI + Core)
├── image_recommender.ipynb # Notebook documentado
├── src/                    # Frontend React (Em desenvolvimento)
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/            # Páginas principais
│   └── ...
├── api/                   # Backend FastAPI (Em desenvolvimento)
│   ├── main.py           # Aplicação principal
│   └── ...
├── .trae/documents/      # Documentação do projeto
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

## 🎯 Como Usar (Núcleo Python)

O foco atual do projeto é o uso via linha de comando ou notebook interativo.

### 1. Via Script Python (CLI)

```bash
# Para indexar uma pasta de imagens
python image_recommender.py index --images ./minhas_imagens --out index.npz

# Para obter recomendações para uma imagem
python image_recommender.py recommend --index index.npz --query consulta.jpg --topk 5
```

### 2. Via Notebook Jupyter

Abra o arquivo [image_recommender.ipynb](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.ipynb) no VS Code ou Jupyter Lab para uma experiência interativa e documentada.

### 3. Executando Testes

```bash
python image_recommender.py --run-tests
```

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

## ⚠️ Estado Atual do Projeto
 
 ### Funcionalidades Implementadas (Foco Principal)
 - ✅ **Script Python Completo** ([image_recommender.py](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.py))
 - ✅ **Notebook Interativo** ([image_recommender.ipynb](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.ipynb))
 - ✅ Extração de embeddings usando ResNet (PyTorch)
 - ✅ Cálculo de similaridade e busca eficiente
 - ✅ Sistema de testes automatizados integrado
 
 ### Interface Web (Em Desenvolvimento)
 - ⚠️ **Frontend React**: Estrutura de arquivos presente, mas sem integração funcional.
 - ⚠️ **Backend FastAPI**: Implementação inicial em andamento.
 - ❌ Integração entre Web e Núcleo Python não concluída.
 
 ### Arquivos Encontrados
 - ✅ [image_recommender.py](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.py): Core do sistema e CLI.
 - ✅ [image_recommender.ipynb](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.ipynb): Guia visual e prático.

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
