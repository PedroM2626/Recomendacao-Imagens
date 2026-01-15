import os
import gradio as gr
from PIL import Image
import numpy as np
from image_recommender import recommend, index_images, load_index

# Configurações globais
IMAGE_DIR = os.getenv("IMAGE_DIR", "dataset")
INDEX_PATH = os.getenv("INDEX_PATH", "index.npz")
DEVICE = os.getenv("DEVICE", "cpu")
MODEL_NAME = os.getenv("MODEL_NAME", "resnet50")
SERVER_PORT = int(os.getenv("GRADIO_SERVER_PORT", 7860))
SERVER_NAME = os.getenv("GRADIO_SERVER_NAME", "0.0.0.0")

def initialize_index():
    """Garante que o índice exista antes de iniciar a interface."""
    if not os.path.exists(INDEX_PATH):
        if os.path.isdir(IMAGE_DIR):
            print(f"Gerando índice inicial para {IMAGE_DIR}...")
            index_images(IMAGE_DIR, INDEX_PATH, device=DEVICE, model_name=MODEL_NAME)
        else:
            print(f"Aviso: Diretório {IMAGE_DIR} não encontrado. O índice não pôde ser gerado.")

def predict(input_img, top_k):
    """Função de processamento para o Gradio."""
    if input_img is None:
        return None, "Por favor, envie uma imagem."
    
    # Salva temporariamente a imagem enviada para processamento
    temp_query = "temp_query.jpg"
    input_img.save(temp_query)
    
    try:
        # Busca recomendações
        results = recommend(INDEX_PATH, temp_query, topk=int(top_k), device=DEVICE, model_name=MODEL_NAME)
        
        # Prepara a galeria de saída
        gallery_items = []
        for path, score in results:
            # Carrega a imagem e adiciona o score como legenda
            img = Image.open(path)
            gallery_items.append((img, f"Score: {score:.4f}"))
            
        return gallery_items, f"Encontradas {len(results)} imagens semelhantes."
    except Exception as e:
        return None, f"Erro: {str(e)}"
    finally:
        if os.path.exists(temp_query):
            os.remove(temp_query)

# Inicializa o índice
initialize_index()

# Interface Gradio
with gr.Blocks(title="Recomendador de Imagens IA") as demo:
    gr.Markdown("# 🖼️ Sistema de Recomendação de Imagens")
    gr.Markdown("Envie uma imagem para encontrar outras visualmente semelhantes no nosso dataset.")
    
    with gr.Row():
        with gr.Column(scale=1):
            input_image = gr.Image(type="pil", label="Imagem de Consulta")
            top_k_slider = gr.Slider(minimum=1, maximum=10, value=5, step=1, label="Quantidade de Recomendações")
            btn = gr.Button("Buscar Semelhantes", variant="primary")
            
        with gr.Column(scale=2):
            status_text = gr.Markdown("Aguardando consulta...")
            output_gallery = gr.Gallery(label="Resultados", show_label=False, columns=3, rows=2, height="auto")

    btn.click(fn=predict, inputs=[input_image, top_k_slider], outputs=[output_gallery, status_text])

    gr.Examples(
        examples=[os.path.join(IMAGE_DIR, f) for f in os.listdir(IMAGE_DIR) if f.endswith(('.png', '.jpg', '.jpeg'))][:5] if os.path.isdir(IMAGE_DIR) else [],
        inputs=input_image,
        label="Exemplos do Dataset"
    )

if __name__ == "__main__":
    print(f"Iniciando servidor em http://{SERVER_NAME}:{SERVER_PORT}")
    demo.launch(server_name=SERVER_NAME, server_port=SERVER_PORT, share=False)
