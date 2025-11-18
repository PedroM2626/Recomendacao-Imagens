import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageUpload from '@/components/ImageUpload';

// Mock do FileReader
const MockFileReader = class {
  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;
  
  readonly EMPTY = 0;
  readonly LOADING = 1;
  readonly DONE = 2;
  
  readyState: 0 | 1 | 2 = 0;
  result: string | ArrayBuffer | null = null;
  error: DOMException | null = null;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onloadstart: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onloadend: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onprogress: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onabort: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  
  readAsDataURL = vi.fn((file: File) => {
    this.result = 'data:image/jpeg;base64,mock';
    this.onload?.({ target: { result: this.result } } as any);
  });
  readAsText = vi.fn();
  readAsArrayBuffer = vi.fn();
  readAsBinaryString = vi.fn();
  abort = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn(() => true);
} as any;

global.FileReader = MockFileReader;

describe('ImageUpload Component', () => {
  it('renderiza corretamente', () => {
    render(<ImageUpload onImageUpload={vi.fn()} />);
    
    expect(screen.getByText('Arraste e solte sua imagem aqui')).toBeInTheDocument();
    expect(screen.getByText('JPEG, PNG, WebP até 10MB')).toBeInTheDocument();
  });

  it('aceita arquivo válido via drag and drop', async () => {
    const mockOnImageUpload = vi.fn();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    const file = new File(['conteudo'], 'teste.jpg', { type: 'image/jpeg' });
    const dropZone = screen.getByText('Arraste e solte sua imagem aqui').parentElement;
    
    fireEvent.dragEnter(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    await waitFor(() => {
      expect(screen.getByText('Informações do arquivo')).toBeInTheDocument();
    });
  });

  it('rejeita arquivo inválido', async () => {
    const mockOnImageUpload = vi.fn();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    const file = new File(['conteudo'], 'teste.txt', { type: 'text/plain' });
    const dropZone = screen.getByText('Arraste e solte sua imagem aqui').parentElement;
    
    // Mock do alert
    window.alert = vi.fn();
    
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    expect(window.alert).toHaveBeenCalledWith('Por favor, selecione uma imagem JPEG, PNG ou WebP.');
  });

  it('rejeita arquivo muito grande', async () => {
    const mockOnImageUpload = vi.fn();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    // Criar arquivo maior que 10MB
    const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'teste.jpg', { type: 'image/jpeg' });
    const dropZone = screen.getByText('Arraste e solte sua imagem aqui').parentElement;
    
    // Mock do alert
    window.alert = vi.fn();
    
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    expect(window.alert).toHaveBeenCalledWith('A imagem deve ter no máximo 10MB.');
  });

  it('chama onImageUpload quando confirmar upload', async () => {
    const mockOnImageUpload = vi.fn();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    const file = new File(['conteudo'], 'teste.jpg', { type: 'image/jpeg' });
    const dropZone = screen.getByText('Arraste e solte sua imagem aqui').parentElement;
    
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    await waitFor(() => {
      const confirmButton = screen.getByText('Confirmar e Enviar');
      fireEvent.click(confirmButton);
    });
    
    expect(mockOnImageUpload).toHaveBeenCalledWith(file);
  });

  it('mostra barra de progresso durante upload', () => {
    render(
      <ImageUpload 
        onImageUpload={vi.fn()} 
        isUploading={true} 
        uploadProgress={50} 
      />
    );
    
    expect(screen.getByText('Enviando... 50%')).toBeInTheDocument();
  });

  it('permite remover imagem selecionada', async () => {
    render(<ImageUpload onImageUpload={vi.fn()} />);
    
    const file = new File(['conteudo'], 'teste.jpg', { type: 'image/jpeg' });
    const dropZone = screen.getByText('Arraste e solte sua imagem aqui').parentElement;
    
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    await waitFor(() => {
      expect(screen.getByText('Informações do arquivo')).toBeInTheDocument();
    });
    
    const removeButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(removeButton);
    
    expect(screen.getByText('Arraste e solte sua imagem aqui')).toBeInTheDocument();
  });
});