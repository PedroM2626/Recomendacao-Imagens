import pytest
import asyncio
from fastapi.testclient import TestClient
from main import app, images_db, feature_vectors

client = TestClient(app)

def test_root():
    """Testa endpoint raiz"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_upload_image():
    """Testa upload de imagem"""
    # Criar uma imagem de teste
    from PIL import Image as PILImage
    import io
    
    # Criar imagem de teste
    img = PILImage.new('RGB', (100, 100), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    files = {"image": ("test.jpg", img_bytes.getvalue(), "image/jpeg")}
    response = client.post("/api/images/upload", files=files)
    
    assert response.status_code == 200
    assert response.json()["success"] == True
    assert "id" in response.json()["data"]

def test_get_images():
    """Testa listagem de imagens"""
    response = client.get("/api/images")
    assert response.status_code == 200
    assert "images" in response.json()
    assert "total" in response.json()

def test_get_image():
    """Testa obtenção de imagem específica"""
    # Primeiro fazer upload de uma imagem
    from PIL import Image as PILImage
    import io
    
    img = PILImage.new('RGB', (100, 100), color='blue')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    files = {"image": ("test2.jpg", img_bytes.getvalue(), "image/jpeg")}
    upload_response = client.post("/api/images/upload", files=files)
    image_id = upload_response.json()["data"]["id"]
    
    # Testar obtenção da imagem
    response = client.get(f"/api/images/{image_id}")
    assert response.status_code == 200
    assert response.json()["id"] == image_id

def test_get_recommendations():
    """Testa obtenção de recomendações"""
    # Fazer upload de algumas imagens primeiro
    from PIL import Image as PILImage
    import io
    
    # Upload de imagem de referência
    img1 = PILImage.new('RGB', (100, 100), color='green')
    img1_bytes = io.BytesIO()
    img1.save(img1_bytes, format='JPEG')
    img1_bytes.seek(0)
    
    files1 = {"image": ("ref.jpg", img1_bytes.getvalue(), "image/jpeg")}
    upload_response = client.post("/api/images/upload", files=files1)
    image_id = upload_response.json()["data"]["id"]
    
    # Aguardar processamento
    import time
    time.sleep(1)
    
    # Testar recomendações
    response = client.get(f"/api/images/{image_id}/recommendations")
    assert response.status_code == 200
    assert "recommendations" in response.json()["data"]

def test_get_stats():
    """Testa obtenção de estatísticas"""
    response = client.get("/api/stats")
    assert response.status_code == 200
    assert "total_images" in response.json()

def test_invalid_image_id():
    """Testa comportamento com ID inválido"""
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = client.get(f"/api/images/{fake_id}")
    assert response.status_code == 404

if __name__ == "__main__":
    pytest.main([__file__])