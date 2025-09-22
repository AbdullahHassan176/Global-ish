export interface OCRProvider {
  extractText(file: Buffer, mimeType: string): Promise<OCRResult>;
  extractTextFromUrl(url: string): Promise<OCRResult>;
}

export interface OCRResult {
  text: string;
  confidence: number;
  language?: string;
  pages?: OCRPage[];
  metadata?: Record<string, any>;
}

export interface OCRPage {
  pageNumber: number;
  text: string;
  confidence: number;
  boundingBoxes?: BoundingBox[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  confidence: number;
}

export interface OCRConfig {
  provider: 'tesseract' | 'aws-textract' | 'azure-cognitive' | 'google-vision';
  apiKey?: string;
  endpoint?: string;
  language?: string;
  confidence?: number;
}
