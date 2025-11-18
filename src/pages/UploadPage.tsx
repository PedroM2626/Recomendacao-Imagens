import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '@/stores/imageStore';
import { imageApi } from '@/services/api';
import ImageUpload from '@/components/ImageUpload';
import { toast } from 'sonner';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsUploading, setUploadProgress, addImage } = useImageStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Upload da imagem
      const response = await imageApi.uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success) {
        toast.success('Imagem enviada com sucesso!');
        
        // Criar objeto de imagem temporário
        const tempImage = {
          id: response.data.id,
          filename: response.data.filename,
          original_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          width: 0, // Será preenchido após processamento
          height: 0, // Será preenchido após processamento
          url: response.data.url,
          thumbnail_url: response.data.url, // Usar URL principal temporariamente
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        addImage(tempImage);
        
        // Processar imagem em background
        setIsProcessing(true);
        try {
          await imageApi.processImage(response.data.id);
          toast.success('Imagem processada com sucesso!');
          
          // Redirecionar para página de recomendações após processamento
          setTimeout(() => {
            navigate(`/recommendations/${response.data.id}`);
          }, 1000);
          
        } catch (processingError) {
          console.error('Erro no processamento:', processingError);
          toast.error('Erro ao processar imagem. As recomendações podem estar limitadas.');
          // Ainda assim redirecionar, mas com aviso
          setTimeout(() => {
            navigate(`/recommendations/${response.data.id}`);
          }, 2000);
        } finally {
          setIsProcessing(false);
        }
      }
      
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [setIsUploading, setUploadProgress, addImage, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Upload de Imagem
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Envie sua imagem para análise
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nossa IA analisará as características visuais da sua imagem e encontrará imagens similares 
            com base em cores, composição e estilo visual.
          </p>
        </div>

        {/* Componente de Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <ImageUpload
            onImageUpload={handleImageUpload}
            isUploading={isProcessing}
          />
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Análise Inteligente
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nossa IA utiliza modelos avançados de visão computacional para entender o conteúdo da sua imagem.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Recomendações Precisas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receba sugestões de imagens similares com alta precisão baseada em múltiplas características visuais.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Processamento Rápido
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Processamento otimizado que garante resultados em segundos, não em minutos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;