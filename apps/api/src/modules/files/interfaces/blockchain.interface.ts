export interface BlockchainProvider {
  anchorDocument(hash: string, metadata?: Record<string, any>): Promise<BlockchainAnchor>;
  verifyAnchor(anchorId: string): Promise<VerificationResult>;
  getAnchor(anchorId: string): Promise<BlockchainAnchor | null>;
}

export interface BlockchainAnchor {
  anchorId: string;
  hash: string;
  blockNumber?: number;
  transactionHash?: string;
  timestamp: Date;
  network: string;
  metadata?: Record<string, any>;
}

export interface VerificationResult {
  isValid: boolean;
  anchorId: string;
  hash: string;
  timestamp: Date;
  blockNumber?: number;
  transactionHash?: string;
}

export interface BlockchainConfig {
  provider: 'ethereum' | 'bitcoin' | 'hyperledger' | 'mock';
  network: string;
  privateKey?: string;
  endpoint?: string;
  contractAddress?: string;
}
