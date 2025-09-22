export interface SignatureProvider {
  createSignatureRequest(request: SignatureRequest): Promise<SignatureRequestResult>;
  getSignatureRequest(requestId: string): Promise<SignatureRequestStatus>;
  cancelSignatureRequest(requestId: string): Promise<void>;
  downloadSignedDocument(requestId: string): Promise<Buffer>;
  getSignatureRequestEvents(requestId: string): Promise<SignatureEvent[]>;
}

export interface SignatureRequest {
  title: string;
  message?: string;
  documents: SignatureDocument[];
  signers: SignatureSigner[];
  cc?: string[]; // Email addresses to CC
  expiresAt?: Date;
  reminderSettings?: SignatureReminderSettings;
  metadata?: Record<string, any>;
}

export interface SignatureDocument {
  name: string;
  content: Buffer;
  mimeType: string;
  fields?: SignatureField[];
}

export interface SignatureField {
  type: 'signature' | 'initial' | 'text' | 'date' | 'checkbox';
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  required?: boolean;
  signerId?: string; // If field is specific to a signer
  value?: any;
}

export interface SignatureSigner {
  id: string;
  email: string;
  name: string;
  role?: string;
  order?: number; // For sequential signing
  authenticationMethod?: 'email' | 'sms' | 'knowledge_based' | 'id_verification';
  phoneNumber?: string;
  metadata?: Record<string, any>;
}

export interface SignatureReminderSettings {
  enabled: boolean;
  interval: number; // Days between reminders
  maxReminders: number;
  message?: string;
}

export interface SignatureRequestResult {
  requestId: string;
  status: SignatureRequestStatus;
  url?: string; // URL for signers to access
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface SignatureRequestStatus {
  requestId: string;
  status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'declined' | 'expired' | 'cancelled';
  signers: SignatureSignerStatus[];
  documents: SignatureDocumentStatus[];
  completedAt?: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface SignatureSignerStatus {
  signerId: string;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  signedAt?: Date;
  declinedAt?: Date;
  declinedReason?: string;
  authenticationMethod?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SignatureDocumentStatus {
  documentId: string;
  name: string;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: Date;
  downloadUrl?: string;
}

export interface SignatureEvent {
  id: string;
  type: 'request_created' | 'request_sent' | 'document_viewed' | 'document_signed' | 'request_completed' | 'request_declined' | 'request_expired' | 'request_cancelled';
  timestamp: Date;
  signerId?: string;
  documentId?: string;
  data?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface SignatureConfig {
  provider: 'docusign' | 'adobe_sign' | 'hellosign' | 'pandadoc';
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  baseUrl?: string;
  webhookUrl?: string;
  testMode?: boolean;
}
