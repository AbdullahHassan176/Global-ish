export interface VirusScanProvider {
  scanFile(file: Buffer, filename: string): Promise<VirusScanResult>;
  scanUrl(url: string): Promise<VirusScanResult>;
}

export interface VirusScanResult {
  isClean: boolean;
  threats: Threat[];
  scanId: string;
  scannedAt: Date;
  engine: string;
}

export interface Threat {
  name: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description?: string;
}

export interface VirusScanConfig {
  provider: 'clamav' | 'virustotal' | 'aws-guardduty';
  endpoint?: string;
  apiKey?: string;
  timeout?: number;
}
