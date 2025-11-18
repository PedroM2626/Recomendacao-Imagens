import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';

describe('HomePage Component', () => {
  it('renderiza hero section corretamente', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Recomendação de')).toBeInTheDocument();
    expect(screen.getByText('Imagens')).toBeInTheDocument();
    expect(screen.getByText('Descubra imagens similares com nossa tecnologia de IA avançada.')).toBeInTheDocument();
  });

  it('renderiza botões de call-to-action', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Começar Agora')).toBeInTheDocument();
    expect(screen.getByText('Explorar Galeria')).toBeInTheDocument();
  });

  it('renderiza seção de funcionalidades', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Como Funciona')).toBeInTheDocument();
    expect(screen.getByText('Upload Simples')).toBeInTheDocument();
    expect(screen.getByText('Busca Inteligente')).toBeInTheDocument();
    expect(screen.getByText('Análise Detalhada')).toBeInTheDocument();
  });

  it('renderiza seção de CTA final', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Pronto para começar?')).toBeInTheDocument();
    expect(screen.getByText('Fazer Upload de Imagem')).toBeInTheDocument();
  });
});