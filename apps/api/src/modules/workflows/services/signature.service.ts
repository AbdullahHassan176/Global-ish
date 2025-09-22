import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  SignatureProvider, 
  SignatureRequest, 
  SignatureRequestResult, 
  SignatureRequestStatus, 
  SignatureConfig 
} from '../interfaces/signature.interface';
import * as axios from 'axios';

@Injectable()
export class SignatureService implements SignatureProvider {
  private readonly logger = new Logger(SignatureService.name);
  private config: SignatureConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      provider: this.configService.get('SIGNATURE_PROVIDER', 'docusign'),
      apiKey: this.configService.get('SIGNATURE_API_KEY'),
      clientId: this.configService.get('SIGNATURE_CLIENT_ID'),
      clientSecret: this.configService.get('SIGNATURE_CLIENT_SECRET'),
      baseUrl: this.configService.get('SIGNATURE_BASE_URL'),
      webhookUrl: this.configService.get('SIGNATURE_WEBHOOK_URL'),
      testMode: this.configService.get('SIGNATURE_TEST_MODE', 'true') === 'true'
    };
  }

  async createSignatureRequest(request: SignatureRequest): Promise<SignatureRequestResult> {
    try {
      switch (this.config.provider) {
        case 'docusign':
          return await this.createDocuSignRequest(request);
        case 'adobe_sign':
          return await this.createAdobeSignRequest(request);
        case 'hellosign':
          return await this.createHelloSignRequest(request);
        case 'pandadoc':
          return await this.createPandaDocRequest(request);
        default:
          throw new Error(`Unsupported signature provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error('Failed to create signature request', error);
      throw error;
    }
  }

  async getSignatureRequest(requestId: string): Promise<SignatureRequestStatus> {
    try {
      switch (this.config.provider) {
        case 'docusign':
          return await this.getDocuSignRequest(requestId);
        case 'adobe_sign':
          return await this.getAdobeSignRequest(requestId);
        case 'hellosign':
          return await this.getHelloSignRequest(requestId);
        case 'pandadoc':
          return await this.getPandaDocRequest(requestId);
        default:
          throw new Error(`Unsupported signature provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to get signature request ${requestId}`, error);
      throw error;
    }
  }

  async cancelSignatureRequest(requestId: string): Promise<void> {
    try {
      switch (this.config.provider) {
        case 'docusign':
          await this.cancelDocuSignRequest(requestId);
          break;
        case 'adobe_sign':
          await this.cancelAdobeSignRequest(requestId);
          break;
        case 'hellosign':
          await this.cancelHelloSignRequest(requestId);
          break;
        case 'pandadoc':
          await this.cancelPandaDocRequest(requestId);
          break;
        default:
          throw new Error(`Unsupported signature provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to cancel signature request ${requestId}`, error);
      throw error;
    }
  }

  async downloadSignedDocument(requestId: string): Promise<Buffer> {
    try {
      switch (this.config.provider) {
        case 'docusign':
          return await this.downloadDocuSignDocument(requestId);
        case 'adobe_sign':
          return await this.downloadAdobeSignDocument(requestId);
        case 'hellosign':
          return await this.downloadHelloSignDocument(requestId);
        case 'pandadoc':
          return await this.downloadPandaDocDocument(requestId);
        default:
          throw new Error(`Unsupported signature provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to download signed document for request ${requestId}`, error);
      throw error;
    }
  }

  async getSignatureRequestEvents(requestId: string): Promise<any[]> {
    try {
      switch (this.config.provider) {
        case 'docusign':
          return await this.getDocuSignEvents(requestId);
        case 'adobe_sign':
          return await this.getAdobeSignEvents(requestId);
        case 'hellosign':
          return await this.getHelloSignEvents(requestId);
        case 'pandadoc':
          return await this.getPandaDocEvents(requestId);
        default:
          throw new Error(`Unsupported signature provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to get events for signature request ${requestId}`, error);
      throw error;
    }
  }

  // DocuSign Implementation
  private async createDocuSignRequest(request: SignatureRequest): Promise<SignatureRequestResult> {
    if (!this.config.apiKey) {
      throw new Error('DocuSign API key not configured');
    }

    try {
      // Create envelope
      const envelope = {
        emailSubject: request.title,
        emailBlurb: request.message,
        documents: request.documents.map((doc, index) => ({
          documentId: (index + 1).toString(),
          name: doc.name,
          documentBase64: doc.content.toString('base64')
        })),
        recipients: {
          signers: request.signers.map((signer, index) => ({
            recipientId: (index + 1).toString(),
            email: signer.email,
            name: signer.name,
            routingOrder: signer.order || (index + 1).toString(),
            tabs: {
              signHereTabs: doc.fields?.filter(field => field.type === 'signature').map(field => ({
                documentId: '1',
                pageNumber: field.page,
                xPosition: field.x,
                yPosition: field.y,
                tabLabel: 'signature'
              })) || []
            }
          }))
        },
        status: 'sent'
      };

      const response = await axios.default.post(
        `${this.config.baseUrl}/restapi/v2.1/accounts/${this.config.clientId}/envelopes`,
        envelope,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        requestId: response.data.envelopeId,
        status: {
          requestId: response.data.envelopeId,
          status: 'sent',
          signers: request.signers.map(signer => ({
            signerId: signer.id,
            status: 'sent'
          })),
          documents: request.documents.map(doc => ({
            documentId: doc.name,
            name: doc.name,
            status: 'pending'
          }))
        },
        url: response.data.uri,
        expiresAt: request.expiresAt
      };
    } catch (error) {
      this.logger.error('DocuSign request creation failed', error);
      throw error;
    }
  }

  private async getDocuSignRequest(requestId: string): Promise<SignatureRequestStatus> {
    try {
      const response = await axios.default.get(
        `${this.config.baseUrl}/restapi/v2.1/accounts/${this.config.clientId}/envelopes/${requestId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      const envelope = response.data;

      return {
        requestId,
        status: envelope.status.toLowerCase(),
        signers: envelope.recipients?.signers?.map((signer: any) => ({
          signerId: signer.recipientId,
          status: signer.status.toLowerCase(),
          signedAt: signer.signedDateTime ? new Date(signer.signedDateTime) : undefined
        })) || [],
        documents: envelope.documents?.map((doc: any) => ({
          documentId: doc.documentId,
          name: doc.name,
          status: envelope.status.toLowerCase() === 'completed' ? 'signed' : 'pending'
        })) || [],
        completedAt: envelope.status === 'completed' ? new Date(envelope.completedDateTime) : undefined
      };
    } catch (error) {
      this.logger.error('DocuSign request retrieval failed', error);
      throw error;
    }
  }

  private async cancelDocuSignRequest(requestId: string): Promise<void> {
    try {
      await axios.default.put(
        `${this.config.baseUrl}/restapi/v2.1/accounts/${this.config.clientId}/envelopes/${requestId}`,
        { status: 'voided', voidedReason: 'Cancelled by user' },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      this.logger.error('DocuSign request cancellation failed', error);
      throw error;
    }
  }

  private async downloadDocuSignDocument(requestId: string): Promise<Buffer> {
    try {
      const response = await axios.default.get(
        `${this.config.baseUrl}/restapi/v2.1/accounts/${this.config.clientId}/envelopes/${requestId}/documents/combined`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      this.logger.error('DocuSign document download failed', error);
      throw error;
    }
  }

  private async getDocuSignEvents(requestId: string): Promise<any[]> {
    try {
      const response = await axios.default.get(
        `${this.config.baseUrl}/restapi/v2.1/accounts/${this.config.clientId}/envelopes/${requestId}/audit_events`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return response.data.auditEvents || [];
    } catch (error) {
      this.logger.error('DocuSign events retrieval failed', error);
      throw error;
    }
  }

  // Adobe Sign Implementation (Mock)
  private async createAdobeSignRequest(request: SignatureRequest): Promise<SignatureRequestResult> {
    this.logger.log('Creating Adobe Sign request (mock implementation)');
    
    // Mock implementation
    const requestId = `adobe_${Date.now()}`;
    
    return {
      requestId,
      status: {
        requestId,
        status: 'sent',
        signers: request.signers.map(signer => ({
          signerId: signer.id,
          status: 'sent'
        })),
        documents: request.documents.map(doc => ({
          documentId: doc.name,
          name: doc.name,
          status: 'pending'
        }))
      },
      url: `https://adobe-sign.example.com/sign/${requestId}`,
      expiresAt: request.expiresAt
    };
  }

  private async getAdobeSignRequest(requestId: string): Promise<SignatureRequestStatus> {
    this.logger.log(`Getting Adobe Sign request ${requestId} (mock implementation)`);
    
    // Mock implementation
    return {
      requestId,
      status: 'completed',
      signers: [{
        signerId: 'signer1',
        status: 'signed',
        signedAt: new Date()
      }],
      documents: [{
        documentId: 'doc1',
        name: 'Document.pdf',
        status: 'signed'
      }],
      completedAt: new Date()
    };
  }

  private async cancelAdobeSignRequest(requestId: string): Promise<void> {
    this.logger.log(`Cancelling Adobe Sign request ${requestId} (mock implementation)`);
  }

  private async downloadAdobeSignDocument(requestId: string): Promise<Buffer> {
    this.logger.log(`Downloading Adobe Sign document ${requestId} (mock implementation)`);
    return Buffer.from('Mock signed document content');
  }

  private async getAdobeSignEvents(requestId: string): Promise<any[]> {
    this.logger.log(`Getting Adobe Sign events ${requestId} (mock implementation)`);
    return [];
  }

  // HelloSign Implementation (Mock)
  private async createHelloSignRequest(request: SignatureRequest): Promise<SignatureRequestResult> {
    this.logger.log('Creating HelloSign request (mock implementation)');
    
    const requestId = `hellosign_${Date.now()}`;
    
    return {
      requestId,
      status: {
        requestId,
        status: 'sent',
        signers: request.signers.map(signer => ({
          signerId: signer.id,
          status: 'sent'
        })),
        documents: request.documents.map(doc => ({
          documentId: doc.name,
          name: doc.name,
          status: 'pending'
        }))
      },
      url: `https://hellosign.com/sign/${requestId}`,
      expiresAt: request.expiresAt
    };
  }

  private async getHelloSignRequest(requestId: string): Promise<SignatureRequestStatus> {
    this.logger.log(`Getting HelloSign request ${requestId} (mock implementation)`);
    
    return {
      requestId,
      status: 'completed',
      signers: [{
        signerId: 'signer1',
        status: 'signed',
        signedAt: new Date()
      }],
      documents: [{
        documentId: 'doc1',
        name: 'Document.pdf',
        status: 'signed'
      }],
      completedAt: new Date()
    };
  }

  private async cancelHelloSignRequest(requestId: string): Promise<void> {
    this.logger.log(`Cancelling HelloSign request ${requestId} (mock implementation)`);
  }

  private async downloadHelloSignDocument(requestId: string): Promise<Buffer> {
    this.logger.log(`Downloading HelloSign document ${requestId} (mock implementation)`);
    return Buffer.from('Mock signed document content');
  }

  private async getHelloSignEvents(requestId: string): Promise<any[]> {
    this.logger.log(`Getting HelloSign events ${requestId} (mock implementation)`);
    return [];
  }

  // PandaDoc Implementation (Mock)
  private async createPandaDocRequest(request: SignatureRequest): Promise<SignatureRequestResult> {
    this.logger.log('Creating PandaDoc request (mock implementation)');
    
    const requestId = `pandadoc_${Date.now()}`;
    
    return {
      requestId,
      status: {
        requestId,
        status: 'sent',
        signers: request.signers.map(signer => ({
          signerId: signer.id,
          status: 'sent'
        })),
        documents: request.documents.map(doc => ({
          documentId: doc.name,
          name: doc.name,
          status: 'pending'
        }))
      },
      url: `https://pandadoc.com/sign/${requestId}`,
      expiresAt: request.expiresAt
    };
  }

  private async getPandaDocRequest(requestId: string): Promise<SignatureRequestStatus> {
    this.logger.log(`Getting PandaDoc request ${requestId} (mock implementation)`);
    
    return {
      requestId,
      status: 'completed',
      signers: [{
        signerId: 'signer1',
        status: 'signed',
        signedAt: new Date()
      }],
      documents: [{
        documentId: 'doc1',
        name: 'Document.pdf',
        status: 'signed'
      }],
      completedAt: new Date()
    };
  }

  private async cancelPandaDocRequest(requestId: string): Promise<void> {
    this.logger.log(`Cancelling PandaDoc request ${requestId} (mock implementation)`);
  }

  private async downloadPandaDocDocument(requestId: string): Promise<Buffer> {
    this.logger.log(`Downloading PandaDoc document ${requestId} (mock implementation)`);
    return Buffer.from('Mock signed document content');
  }

  private async getPandaDocEvents(requestId: string): Promise<any[]> {
    this.logger.log(`Getting PandaDoc events ${requestId} (mock implementation)`);
    return [];
  }
}
