import React from 'react';
import { Image as ImageIcon, Upload, Search, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      title: 'Upload Simples',
      description: 'Arraste e solte ou selecione imagens de forma rápida e intuitiva.'
    },
    {
      icon: <Search className="w-8 h-8 text-green-600" />,
      title: 'Busca Inteligente',
      description: 'Encontre imagens similares baseadas em cores, estilo e conteúdo visual.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: 'Análise Detalhada',
      description: 'Obtenha insights visuais e estatísticas sobre suas imagens.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <ImageIcon className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Recomendação de
              <span className="text-blue-600 dark:text-blue-400"> Imagens</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Descubra imagens similares com nossa tecnologia de IA avançada. 
              Faça upload de uma imagem e receba recomendações precisas baseadas em análise visual inteligente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/upload')}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <Upload className="w-5 h-5 mr-2" />
                Começar Agora
              </button>
              
              <button
                onClick={() => navigate('/gallery')}
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Explorar Galeria
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Nossa plataforma utiliza inteligência artificial de ponta para analisar e recomendar imagens similares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Experimente nossa tecnologia de recomendação de imagens. É rápido, fácil e gratuito!
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Upload className="w-5 h-5 mr-2" />
            Fazer Upload de Imagem
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;