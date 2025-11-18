import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useImageStore } from '@/stores/imageStore';
import { imageApi } from '@/services/api';
import { ArrowLeft, Download, Heart, Share2, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import { Recommendation } from '@/types/image';

const RecommendationsPage: React.FC = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { currentImage, recommendations, setCurrentImage, setRecommendations } = useImageStore();
  const [loading, setLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    if (imageId) {
      loadRecommendations(imageId);
    }
  }, [imageId]);

  const loadRecommendations = async (id: string) => {
    try {
      setLoading(true);
      
      // Carregar imagem atual se não estiver no store
      if (!currentImage || currentImage.id !== id) {
        const image = await imageApi.getImage(id);
        setCurrentImage(image);
      }
      
      // Carregar recomendações
      const response = await imageApi.getRecommendations(id, 12, 0.6);
      setRecommendations(response.data.recommendations);
      
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      toast.error('Erro ao carregar recomendações');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
  };

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Imagem baixada com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
      toast.error('Erro ao baixar imagem');
    }
  };

  const handleShare = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Recomendação de Imagem',
          url: imageUrl,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(imageUrl);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando recomendações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Imagens Similares
              </h1>
            </div>
            
            <button
              onClick={() => navigate('/upload')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Nova Busca
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Imagem de referência */}
        {currentImage && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Imagem de Referência
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={currentImage.url}
                    alt={currentImage.original_name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {currentImage.original_name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Dimensões:</strong> {currentImage.width} × {currentImage.height}px</p>
                    <p><strong>Tamanho:</strong> {(currentImage.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Formato:</strong> {currentImage.mime_type}</p>
                    <p><strong>Enviado em:</strong> {new Date(currentImage.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  
                  {/* Cores dominantes */}
                  {currentImage.metadata?.colors && currentImage.metadata.colors.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Cores Dominantes:
                      </p>
                      <div className="flex gap-2">
                        {currentImage.metadata.colors.slice(0, 5).map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                            style={{ backgroundColor: color.hex }}
                            title={`${color.name} (${(color.percentage * 100).toFixed(1)}%)`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendações */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Imagens Similares ({recommendations.length})
          </h2>
          
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Nenhuma imagem similar encontrada. Tente fazer upload de outra imagem.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((recommendation, index) => (
                <div
                  key={recommendation.image.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => handleImageClick(recommendation)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={recommendation.image.url}
                      alt={recommendation.image.original_name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Badge de similaridade */}
                    <div className="absolute top-2 right-2">
                      <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {(recommendation.similarity_score * 100).toFixed(0)}% similar
                      </div>
                    </div>

                    {/* Overlay de ações */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(recommendation.image.url, recommendation.image.original_name);
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(recommendation.image.url);
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Share2 className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 truncate">
                      {recommendation.image.original_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {recommendation.explanation}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                      <span>{(recommendation.image.file_size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>{recommendation.image.width}×{recommendation.image.height}px</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualização */}
      {selectedRecommendation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRecommendation(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Visualização da Imagem
                </h3>
                <button
                  onClick={() => setSelectedRecommendation(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedRecommendation.image.url}
                    alt={selectedRecommendation.image.original_name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {selectedRecommendation.image.original_name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {selectedRecommendation.explanation}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Similaridade:</strong> {(selectedRecommendation.similarity_score * 100).toFixed(1)}%</p>
                    <p><strong>Dimensões:</strong> {selectedRecommendation.image.width}×{selectedRecommendation.image.height}px</p>
                    <p><strong>Tamanho:</strong> {(selectedRecommendation.image.file_size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleDownload(selectedRecommendation.image.url, selectedRecommendation.image.original_name)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Baixar
                    </button>
                    <button
                      onClick={() => handleShare(selectedRecommendation.image.url)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;