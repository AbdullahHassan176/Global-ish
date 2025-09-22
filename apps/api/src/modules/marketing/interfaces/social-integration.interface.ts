export interface SocialMediaCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope?: string[];
  userId?: string;
  username?: string;
}

export interface SocialMediaSettings {
  autoPost?: boolean;
  postFrequency?: 'immediate' | 'scheduled' | 'batch';
  timezone?: string;
  hashtags?: string[];
  mentions?: string[];
  linkPreview?: boolean;
}

export interface SocialMediaPost {
  id: string;
  content: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
  publishedAt?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platform: string;
  metadata?: any;
}

export interface SocialMediaAnalytics {
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  date: Date;
}

export interface ISocialMediaIntegration {
  platform: string;
  authenticate(credentials: SocialMediaCredentials): Promise<boolean>;
  postContent(post: SocialMediaPost): Promise<string>;
  schedulePost(post: SocialMediaPost, scheduledAt: Date): Promise<string>;
  getAnalytics(postId: string, dateRange: { start: Date; end: Date }): Promise<SocialMediaAnalytics[]>;
  refreshCredentials(credentials: SocialMediaCredentials): Promise<SocialMediaCredentials>;
  revokeAccess(credentials: SocialMediaCredentials): Promise<boolean>;
}

export interface LinkedInIntegration extends ISocialMediaIntegration {
  platform: 'LINKEDIN';
  shareArticle(articleUrl: string, comment: string): Promise<string>;
  createCompanyUpdate(content: string, mediaUrls?: string[]): Promise<string>;
}

export interface InstagramIntegration extends ISocialMediaIntegration {
  platform: 'INSTAGRAM';
  postPhoto(imageUrl: string, caption: string): Promise<string>;
  postStory(imageUrl: string, caption?: string): Promise<string>;
  postVideo(videoUrl: string, caption: string): Promise<string>;
}

export interface GoogleAdsIntegration extends ISocialMediaIntegration {
  platform: 'GOOGLE_ADS';
  createCampaign(campaignData: any): Promise<string>;
  createAdGroup(campaignId: string, adGroupData: any): Promise<string>;
  createAd(adGroupId: string, adData: any): Promise<string>;
  getCampaignPerformance(campaignId: string, dateRange: { start: Date; end: Date }): Promise<any>;
}
