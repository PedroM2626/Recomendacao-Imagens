import '@testing-library/jest-dom';
import { vi } from 'vitest';

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

// Mock do window.URL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock do navigator.share
global.navigator = {
  ...global.navigator,
  share: vi.fn().mockResolvedValue(undefined),
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    read: vi.fn().mockResolvedValue(''),
    readText: vi.fn().mockResolvedValue(''),
    write: vi.fn().mockResolvedValue(undefined),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  },
};