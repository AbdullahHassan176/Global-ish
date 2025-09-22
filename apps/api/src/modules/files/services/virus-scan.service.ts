import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VirusScanProvider, VirusScanResult, VirusScanConfig } from '../interfaces/virus-scan.interface';
import * as axios from 'axios';

@Injectable()
export class VirusScanService implements VirusScanProvider {
  private readonly logger = new Logger(VirusScanService.name);
  private config: VirusScanConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      provider: this.configService.get('VIRUS_SCAN_PROVIDER', 'clamav'),
      endpoint: this.configService.get('VIRUS_SCAN_ENDPOINT'),
      apiKey: this.configService.get('VIRUS_SCAN_API_KEY'),
      timeout: this.configService.get('VIRUS_SCAN_TIMEOUT', 30000)
    };
  }

  async scanFile(file: Buffer, filename: string): Promise<VirusScanResult> {
    try {
      switch (this.config.provider) {
        case 'clamav':
          return await this.scanWithClamAV(file, filename);
        case 'virustotal':
          return await this.scanWithVirusTotal(file, filename);
        case 'aws-guardduty':
          return await this.scanWithAWSGuardDuty(file, filename);
        default:
          throw new Error(`Unsupported virus scan provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Virus scan failed for ${filename}`, error);
      throw error;
    }
  }

  async scanUrl(url: string): Promise<VirusScanResult> {
    try {
      switch (this.config.provider) {
        case 'virustotal':
          return await this.scanUrlWithVirusTotal(url);
        case 'aws-guardduty':
          return await this.scanUrlWithAWSGuardDuty(url);
        default:
          throw new Error(`URL scanning not supported for provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`URL virus scan failed for ${url}`, error);
      throw error;
    }
  }

  private async scanWithClamAV(file: Buffer, filename: string): Promise<VirusScanResult> {
    // Mock implementation - in real scenario, you'd connect to ClamAV daemon
    this.logger.log(`Scanning ${filename} with ClamAV`);
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock clean result
    return {
      isClean: true,
      threats: [],
      scanId: `clamav_${Date.now()}`,
      scannedAt: new Date(),
      engine: 'ClamAV'
    };
  }

  private async scanWithVirusTotal(file: Buffer, filename: string): Promise<VirusScanResult> {
    if (!this.config.apiKey) {
      throw new Error('VirusTotal API key not configured');
    }

    try {
      // Upload file for scanning
      const formData = new FormData();
      formData.append('file', new Blob([file]), filename);

      const uploadResponse = await axios.default.post(
        'https://www.virustotal.com/vtapi/v2/file/scan',
        formData,
        {
          headers: {
            'X-Apikey': this.config.apiKey,
            'Content-Type': 'multipart/form-data'
          },
          timeout: this.config.timeout
        }
      );

      const scanId = uploadResponse.data.scan_id;
      
      // Wait for scan completion
      let scanResult;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const reportResponse = await axios.default.get(
          `https://www.virustotal.com/vtapi/v2/file/report`,
          {
            params: { apikey: this.config.apiKey, resource: scanId },
            timeout: this.config.timeout
          }
        );

        scanResult = reportResponse.data;
        attempts++;
      } while (scanResult.response_code === -2 && attempts < maxAttempts);

      if (scanResult.response_code !== 1) {
        throw new Error('VirusTotal scan failed or timed out');
      }

      const threats = [];
      if (scanResult.positives > 0) {
        for (const [engine, result] of Object.entries(scanResult.scans)) {
          if (result.detected) {
            threats.push({
              name: result.result,
              type: 'malware',
              severity: this.getSeverityFromResult(result.result),
              description: `Detected by ${engine}`
            });
          }
        }
      }

      return {
        isClean: scanResult.positives === 0,
        threats,
        scanId,
        scannedAt: new Date(),
        engine: 'VirusTotal'
      };
    } catch (error) {
      this.logger.error('VirusTotal scan failed', error);
      throw error;
    }
  }

  private async scanWithAWSGuardDuty(file: Buffer, filename: string): Promise<VirusScanResult> {
    // Mock implementation for AWS GuardDuty
    this.logger.log(`Scanning ${filename} with AWS GuardDuty`);
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock clean result
    return {
      isClean: true,
      threats: [],
      scanId: `guardduty_${Date.now()}`,
      scannedAt: new Date(),
      engine: 'AWS GuardDuty'
    };
  }

  private async scanUrlWithVirusTotal(url: string): Promise<VirusScanResult> {
    if (!this.config.apiKey) {
      throw new Error('VirusTotal API key not configured');
    }

    try {
      // Submit URL for scanning
      const submitResponse = await axios.default.post(
        'https://www.virustotal.com/vtapi/v2/url/scan',
        {
          apikey: this.config.apiKey,
          url: url
        },
        {
          timeout: this.config.timeout
        }
      );

      const scanId = submitResponse.data.scan_id;
      
      // Wait for scan completion
      let scanResult;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const reportResponse = await axios.default.get(
          `https://www.virustotal.com/vtapi/v2/url/report`,
          {
            params: { apikey: this.config.apiKey, resource: scanId },
            timeout: this.config.timeout
          }
        );

        scanResult = reportResponse.data;
        attempts++;
      } while (scanResult.response_code === -2 && attempts < maxAttempts);

      if (scanResult.response_code !== 1) {
        throw new Error('VirusTotal URL scan failed or timed out');
      }

      const threats = [];
      if (scanResult.positives > 0) {
        for (const [engine, result] of Object.entries(scanResult.scans)) {
          if (result.detected) {
            threats.push({
              name: result.result,
              type: 'malicious_url',
              severity: this.getSeverityFromResult(result.result),
              description: `Detected by ${engine}`
            });
          }
        }
      }

      return {
        isClean: scanResult.positives === 0,
        threats,
        scanId,
        scannedAt: new Date(),
        engine: 'VirusTotal'
      };
    } catch (error) {
      this.logger.error('VirusTotal URL scan failed', error);
      throw error;
    }
  }

  private async scanUrlWithAWSGuardDuty(url: string): Promise<VirusScanResult> {
    // Mock implementation for AWS GuardDuty URL scanning
    this.logger.log(`Scanning URL ${url} with AWS GuardDuty`);
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock clean result
    return {
      isClean: true,
      threats: [],
      scanId: `guardduty_url_${Date.now()}`,
      scannedAt: new Date(),
      engine: 'AWS GuardDuty'
    };
  }

  private getSeverityFromResult(result: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const lowerResult = result.toLowerCase();
    
    if (lowerResult.includes('trojan') || lowerResult.includes('virus') || lowerResult.includes('malware')) {
      return 'CRITICAL';
    }
    
    if (lowerResult.includes('suspicious') || lowerResult.includes('phishing')) {
      return 'HIGH';
    }
    
    if (lowerResult.includes('risk') || lowerResult.includes('potentially')) {
      return 'MEDIUM';
    }
    
    return 'LOW';
  }
}
