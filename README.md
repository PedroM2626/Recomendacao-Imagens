# Sistema de Recomendação de Imagens

Sistema de recomendação de imagens baseado em inteligência artificial (CNN/ResNet) para extração de características e busca por similaridade. O projeto foca no uso prático através de um script CLI e um notebook interativo.

## 🚀 Funcionalidades

- ✅ **Extração de Embeddings**: Uso de modelos pré-treinados (ResNet50/ResNet18) via PyTorch.
- ✅ **Busca por Similaridade**: Algoritmo de busca rápida usando similaridade de cosseno.
- ✅ **CLI Completa**: Script [image_recommender.py](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.py) para indexação e recomendação via linha de comando.
- ✅ **Notebook Interativo**: [image_recommender.ipynb](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.ipynb) totalmente comentado e pronto para uso com visualização de resultados.
- ✅ **Interface Gradio**: Interface web amigável em [app.py](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/app.py) para uso simplificado.
- ✅ **Testes Automatizados**: Suíte de testes unitários, integração e aceitação inclusos no script.

## 📁 Estrutura do Projeto

```
Recomendacao-Imagens/
├── app.py                  # Interface Web (Gradio)
├── image_recommender.py    # Script principal (CLI + Core + Testes)
├── image_recommender.ipynb # Notebook documentado e interativo
├── requirements.txt        # Dependências do projeto
├── dataset/                # Diretório padrão com imagens para teste
├── .env.example            # Exemplo de configurações de ambiente
└── README.md               # Documentação do projeto
```

## 🛠️ Tecnologias Utilizadas

- **Python 3.11+** - Linguagem principal
- **PyTorch / Torchvision** - Extração de características (ResNet)
- **Gradio** - Interface web interativa
- **NumPy** - Computação numérica e armazenamento de índices
- **PIL (Pillow)** - Processamento e manipulação de imagens
- **Matplotlib / ipywidgets** - Visualização e interface no Notebook
- **Python-dotenv** - Gerenciamento de variáveis de ambiente

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Recomendacao-Imagens
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. (Opcional) Configure o arquivo `.env`:
```bash
cp .env.example .env
```

## 🎯 Como Usar

### 1. Interface Web (Gradio)

A forma mais fácil de usar o projeto visualmente:

```bash
python app.py
```
Isso abrirá uma interface no seu navegador (geralmente em `http://localhost:7860`) onde você pode arrastar imagens e ver as recomendações.

### 2. Via Script Python (CLI)

O script suporta dois comandos principais: `index` (para criar o índice de busca) e `recommend` (para buscar imagens semelhantes).

```bash
# Para indexar uma pasta de imagens (padrão: dataset/)
python image_recommender.py index --images ./dataset --out index.npz

# Para obter recomendações para uma imagem
python image_recommender.py recommend --index index.npz --query consulta.jpg --topk 5
```

### 2. Via Notebook Jupyter

Abra o arquivo [image_recommender.ipynb](file:///c:/Users/pedro/Downloads/Recomendacao-Imagens/image_recommender.ipynb) para uma experiência interativa. O notebook permite:
- Configurar o modelo (ResNet18/50).
- Indexar o dataset visualmente.
- **Escolher uma imagem e ver os resultados semelhantes instantaneamente.**

## 🧪 Testes e Qualidade

O projeto inclui uma suíte completa de testes para garantir o funcionamento do núcleo:

```bash
# Executa testes unitários, integração e aceitação
python image_recommender.py --run-tests
```

- **Testes Unitários**: Valida extração de embeddings e geração de índices.
- **Testes de Integração**: Verifica o fluxo completo entre arquivos e funções.
- **Testes de Aceitação**: Simula o uso real via CLI para garantir que os resultados são consistentes.

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido para busca inteligente por similaridade visual.**
