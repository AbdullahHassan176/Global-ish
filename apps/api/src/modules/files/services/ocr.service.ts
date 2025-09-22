import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OCRProvider, OCRResult, OCRConfig } from '../interfaces/ocr.interface';
import * as axios from 'axios';

@Injectable()
export class OCRService implements OCRProvider {
  private readonly logger = new Logger(OCRService.name);
  private config: OCRConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      provider: this.configService.get('OCR_PROVIDER', 'tesseract'),
      apiKey: this.configService.get('OCR_API_KEY'),
      endpoint: this.configService.get('OCR_ENDPOINT'),
      language: this.configService.get('OCR_LANGUAGE', 'eng'),
      confidence: this.configService.get('OCR_CONFIDENCE', 0.8)
    };
  }

  async extractText(file: Buffer, mimeType: string): Promise<OCRResult> {
    try {
      switch (this.config.provider) {
        case 'tesseract':
          return await this.extractWithTesseract(file, mimeType);
        case 'aws-textract':
          return await this.extractWithAWSTextract(file, mimeType);
        case 'azure-cognitive':
          return await this.extractWithAzureCognitive(file, mimeType);
        case 'google-vision':
          return await this.extractWithGoogleVision(file, mimeType);
        default:
          throw new Error(`Unsupported OCR provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error('OCR extraction failed', error);
      throw error;
    }
  }

  async extractTextFromUrl(url: string): Promise<OCRResult> {
    try {
      switch (this.config.provider) {
        case 'aws-textract':
          return await this.extractFromUrlWithAWSTextract(url);
        case 'azure-cognitive':
          return await this.extractFromUrlWithAzureCognitive(url);
        case 'google-vision':
          return await this.extractFromUrlWithGoogleVision(url);
        default:
          throw new Error(`URL OCR not supported for provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error('URL OCR extraction failed', error);
      throw error;
    }
  }

  private async extractWithTesseract(file: Buffer, mimeType: string): Promise<OCRResult> {
    // Mock implementation - in real scenario, you'd use Tesseract.js or spawn tesseract process
    this.logger.log(`Extracting text with Tesseract for ${mimeType}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock result
    return {
      text: 'This is mock OCR text extracted from the document.',
      confidence: 0.95,
      language: this.config.language,
      pages: [
        {
          pageNumber: 1,
          text: 'This is mock OCR text extracted from the document.',
          confidence: 0.95,
          boundingBoxes: []
        }
      ],
      metadata: {
        provider: 'tesseract',
        mimeType,
        processingTime: 2000
      }
    };
  }

  private async extractWithAWSTextract(file: Buffer, mimeType: string): Promise<OCRResult> {
    // Mock implementation for AWS Textract
    this.logger.log(`Extracting text with AWS Textract for ${mimeType}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock result
    return {
      text: 'AWS Textract extracted text from the document.',
      confidence: 0.92,
      language: 'en',
      pages: [
        {
          pageNumber: 1,
          text: 'AWS Textract extracted text from the document.',
          confidence: 0.92,
          boundingBoxes: []
        }
      ],
      metadata: {
        provider: 'aws-textract',
        mimeType,
        processingTime: 3000
      }
    };
  }

  private async extractWithAzureCognitive(file: Buffer, mimeType: string): Promise<OCRResult> {
    if (!this.config.apiKey || !this.config.endpoint) {
      throw new Error('Azure Cognitive Services API key and endpoint not configured');
    }

    try {
      const response = await axios.default.post(
        `${this.config.endpoint}/vision/v3.2/read/analyze`,
        file,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.config.apiKey,
            'Content-Type': mimeType
          },
          timeout: 30000
        }
      );

      const operationLocation = response.headers['operation-location'];
      
      // Poll for results
      let result;
      let attempts = 0;
      const maxAttempts = 20;

      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const resultResponse = await axios.default.get(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': this.config.apiKey
          }
        });

        result = resultResponse.data;
        attempts++;
      } while (result.status === 'running' && attempts < maxAttempts);

      if (result.status !== 'succeeded') {
        throw new Error('Azure OCR processing failed or timed out');
      }

      const pages = result.analyzeResult.readResults.map((page: any, index: number) => ({
        pageNumber: index + 1,
        text: page.lines.map((line: any) => line.text).join('\n'),
        confidence: page.lines.reduce((acc: number, line: any) => acc + line.confidence, 0) / page.lines.length,
        boundingBoxes: page.lines.map((line: any) => ({
          x: line.boundingBox[0],
          y: line.boundingBox[1],
          width: line.boundingBox[4] - line.boundingBox[0],
          height: line.boundingBox[5] - line.boundingBox[1],
          text: line.text,
          confidence: line.confidence
        }))
      }));

      const fullText = pages.map(page => page.text).join('\n');
      const avgConfidence = pages.reduce((acc, page) => acc + page.confidence, 0) / pages.length;

      return {
        text: fullText,
        confidence: avgConfidence,
        language: 'en',
        pages,
        metadata: {
          provider: 'azure-cognitive',
          mimeType,
          processingTime: attempts * 1000
        }
      };
    } catch (error) {
      this.logger.error('Azure Cognitive Services OCR failed', error);
      throw error;
    }
  }

  private async extractWithGoogleVision(file: Buffer, mimeType: string): Promise<OCRResult> {
    if (!this.config.apiKey) {
      throw new Error('Google Vision API key not configured');
    }

    try {
      const response = await axios.default.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.config.apiKey}`,
        {
          requests: [
            {
              image: {
                content: file.toString('base64')
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1
                }
              ]
            }
          ]
        },
        {
          timeout: 30000
        }
      );

      const annotations = response.data.responses[0].textAnnotations;
      
      if (!annotations || annotations.length === 0) {
        return {
          text: '',
          confidence: 0,
          language: 'en',
          pages: [],
          metadata: {
            provider: 'google-vision',
            mimeType,
            processingTime: 0
          }
        };
      }

      const fullText = annotations[0].description;
      const confidence = annotations[0].score || 0.9;

      const pages = [
        {
          pageNumber: 1,
          text: fullText,
          confidence,
          boundingBoxes: annotations.slice(1).map((annotation: any) => ({
            x: annotation.boundingPoly.vertices[0].x,
            y: annotation.boundingPoly.vertices[0].y,
            width: annotation.boundingPoly.vertices[2].x - annotation.boundingPoly.vertices[0].x,
            height: annotation.boundingPoly.vertices[2].y - annotation.boundingPoly.vertices[0].y,
            text: annotation.description,
            confidence: annotation.score || 0.9
          }))
        }
      ];

      return {
        text: fullText,
        confidence,
        language: 'en',
        pages,
        metadata: {
          provider: 'google-vision',
          mimeType,
          processingTime: 1000
        }
      };
    } catch (error) {
      this.logger.error('Google Vision OCR failed', error);
      throw error;
    }
  }

  private async extractFromUrlWithAWSTextract(url: string): Promise<OCRResult> {
    // Mock implementation for AWS Textract URL processing
    this.logger.log(`Extracting text from URL with AWS Textract: ${url}`);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    return {
      text: 'AWS Textract extracted text from URL document.',
      confidence: 0.88,
      language: 'en',
      pages: [
        {
          pageNumber: 1,
          text: 'AWS Textract extracted text from URL document.',
          confidence: 0.88,
          boundingBoxes: []
        }
      ],
      metadata: {
        provider: 'aws-textract',
        source: 'url',
        url,
        processingTime: 2500
      }
    };
  }

  private async extractFromUrlWithAzureCognitive(url: string): Promise<OCRResult> {
    if (!this.config.apiKey || !this.config.endpoint) {
      throw new Error('Azure Cognitive Services API key and endpoint not configured');
    }

    try {
      const response = await axios.default.post(
        `${this.config.endpoint}/vision/v3.2/read/analyze`,
        {
          url: url
        },
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.config.apiKey,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const operationLocation = response.headers['operation-location'];
      
      // Poll for results (same logic as file processing)
      let result;
      let attempts = 0;
      const maxAttempts = 20;

      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const resultResponse = await axios.default.get(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': this.config.apiKey
          }
        });

        result = resultResponse.data;
        attempts++;
      } while (result.status === 'running' && attempts < maxAttempts);

      if (result.status !== 'succeeded') {
        throw new Error('Azure OCR processing failed or timed out');
      }

      // Process results (same as file processing)
      const pages = result.analyzeResult.readResults.map((page: any, index: number) => ({
        pageNumber: index + 1,
        text: page.lines.map((line: any) => line.text).join('\n'),
        confidence: page.lines.reduce((acc: number, line: any) => acc + line.confidence, 0) / page.lines.length,
        boundingBoxes: page.lines.map((line: any) => ({
          x: line.boundingBox[0],
          y: line.boundingBox[1],
          width: line.boundingBox[4] - line.boundingBox[0],
          height: line.boundingBox[5] - line.boundingBox[1],
          text: line.text,
          confidence: line.confidence
        }))
      }));

      const fullText = pages.map(page => page.text).join('\n');
      const avgConfidence = pages.reduce((acc, page) => acc + page.confidence, 0) / pages.length;

      return {
        text: fullText,
        confidence: avgConfidence,
        language: 'en',
        pages,
        metadata: {
          provider: 'azure-cognitive',
          source: 'url',
          url,
          processingTime: attempts * 1000
        }
      };
    } catch (error) {
      this.logger.error('Azure Cognitive Services URL OCR failed', error);
      throw error;
    }
  }

  private async extractFromUrlWithGoogleVision(url: string): Promise<OCRResult> {
    if (!this.config.apiKey) {
      throw new Error('Google Vision API key not configured');
    }

    try {
      const response = await axios.default.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.config.apiKey}`,
        {
          requests: [
            {
              image: {
                source: {
                  imageUri: url
                }
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1
                }
              ]
            }
          ]
        },
        {
          timeout: 30000
        }
      );

      const annotations = response.data.responses[0].textAnnotations;
      
      if (!annotations || annotations.length === 0) {
        return {
          text: '',
          confidence: 0,
          language: 'en',
          pages: [],
          metadata: {
            provider: 'google-vision',
            source: 'url',
            url,
            processingTime: 0
          }
        };
      }

      const fullText = annotations[0].description;
      const confidence = annotations[0].score || 0.9;

      const pages = [
        {
          pageNumber: 1,
          text: fullText,
          confidence,
          boundingBoxes: annotations.slice(1).map((annotation: any) => ({
            x: annotation.boundingPoly.vertices[0].x,
            y: annotation.boundingPoly.vertices[0].y,
            width: annotation.boundingPoly.vertices[2].x - annotation.boundingPoly.vertices[0].x,
            height: annotation.boundingPoly.vertices[2].y - annotation.boundingPoly.vertices[0].y,
            text: annotation.description,
            confidence: annotation.score || 0.9
          }))
        }
      ];

      return {
        text: fullText,
        confidence,
        language: 'en',
        pages,
        metadata: {
          provider: 'google-vision',
          source: 'url',
          url,
          processingTime: 1000
        }
      };
    } catch (error) {
      this.logger.error('Google Vision URL OCR failed', error);
      throw error;
    }
  }
}
