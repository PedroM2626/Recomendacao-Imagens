import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  isUploading = false, 
  uploadProgress = 0 
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    // Validação de tipo e tamanho
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Por favor, selecione uma imagem JPEG, PNG ou WebP.');
      return;
    }

    if (file.size > maxSize) {
      alert('A imagem deve ter no máximo 10MB.');
      return;
    }

    setSelectedFile(file);
    
    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && !isUploading) {
      await onImageUpload(selectedFile);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Área de Upload */}
      {!preview && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            dragActive 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Arraste e solte sua imagem aqui
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ou clique para selecionar um arquivo
              </p>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              JPEG, PNG, WebP até 10MB
            </p>
          </div>
          
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </div>
      )}

      {/* Preview da Imagem */}
      {preview && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            
            {/* Overlay com informações */}
            <div className="absolute top-2 right-2">
              <button
                onClick={handleRemove}
                disabled={isUploading}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de progresso do upload */}
            {isUploading && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-white text-xs text-center mt-1">
                  Enviando... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Informações do arquivo */}
          {selectedFile && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Informações do arquivo
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Nome:</strong> {selectedFile.name}</p>
                <p><strong>Tamanho:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Tipo:</strong> {selectedFile.type}</p>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirmar e Enviar
                </>
              )}
            </button>
            
            <button
              onClick={handleRemove}
              disabled={isUploading}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;