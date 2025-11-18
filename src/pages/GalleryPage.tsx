import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '@/stores/imageStore';
import { imageApi } from '@/services/api';
import { Image as ImageIcon, Upload, ArrowRight, Download, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { images, setImages } = useImageStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async (loadMore = false) => {
    try {
      setLoading(true);
      const currentPage = loadMore ? page + 1 : 1;
      
      // Simular carregamento de imagens (mock para demonstração)
      // Em produção, isso viria da API real
      const mockImages = Array.from({ length: 12 }, (_, index) => ({
        id: `mock-${currentPage}-${index}`,
        filename: `image-${currentPage}-${index}.jpg`,
        original_name: `Imagem ${currentPage * 12 + index}`,
        file_size: Math.floor(Math.random() * 5000000) + 500000,
        mime_type: 'image/jpeg',
        width: 1920,
        height: 1080,
        url: `https://picsum.photos/400/300?random=${currentPage * 12 + index}`,
        thumbnail_url: `https://picsum.photos/200/150?random=${currentPage * 12 + index}`,
        metadata: {
          colors: [
            { hex: '#FF6B6B', percentage: 0.3, name: 'Vermelho' },
            { hex: '#4ECDC4', percentage: 0.25, name: 'Turquesa' },
            { hex: '#45B7D1', percentage: 0.2, name: 'Azul' },
          ],
          tags: ['natureza', 'paisagem', 'vibrante'],
          confidence_score: Math.random() * 0.5 + 0.5,
        },
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }));

      if (loadMore) {
        setImages([...images, ...mockImages]);
        setPage(currentPage);
      } else {
        setImages(mockImages);
        setPage(1);
      }
      
      // Simular limite de páginas
      setHasMore(currentPage < 5);
      
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      toast.error('Erro ao carregar galeria');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageId: string) => {
    navigate(`/recommendations/${imageId}`);
  };

  const handleUploadNew = () => {
    navigate('/upload');
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

  const filteredImages = images.filter(image => {
    const matchesSearch = image.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.metadata?.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'recent') {
      const daysDiff = (Date.now() - new Date(image.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return matchesSearch && daysDiff <= 7;
    }
    if (filterType === 'large') return matchesSearch && image.file_size > 2000000;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Galeria de Imagens
                </h1>
              </div>
            </div>
            
            <button
              onClick={handleUploadNew}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Nova Imagem
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Busca */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Todas</option>
                <option value="recent">Recentes</option>
                <option value="large">Arquivos Grandes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Imagens */}
        {loading && images.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Carregando imagens...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Nenhuma imagem encontrada com os filtros aplicados.' 
                : 'Nenhuma imagem na galeria ainda.'}
            </p>
            <button
              onClick={handleUploadNew}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Enviar Primeira Imagem
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleImageClick(image.id)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={image.thumbnail_url}
                    alt={image.original_name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Overlay de ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image.url, image.original_name);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Download className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/recommendations/${image.id}`);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Cores dominantes */}
                  {image.metadata?.colors && image.metadata.colors.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {image.metadata.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 truncate">
                    {image.original_name}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <span>{(image.file_size / 1024 / 1024).toFixed(1)} MB</span>
                    <span>{image.width}×{image.height}px</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {image.metadata?.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão de carregar mais */}
        {hasMore && filteredImages.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => loadImages(true)}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {loading ? 'Carregando...' : 'Carregar Mais'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;