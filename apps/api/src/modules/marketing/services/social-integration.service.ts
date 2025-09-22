import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ISocialMediaIntegration, SocialMediaCredentials, SocialMediaPost, SocialMediaAnalytics } from '../interfaces/social-integration.interface';
import { SocialPlatform, IntegrationStatus } from '../dto/marketing.dto';

@Injectable()
export class SocialIntegrationService {
  private readonly logger = new Logger(SocialIntegrationService.name);
  private integrations: Map<SocialPlatform, ISocialMediaIntegration> = new Map();

  constructor(private prisma: PrismaService) {}

  // Register integration implementations
  registerIntegration(platform: SocialPlatform, integration: ISocialMediaIntegration) {
    this.integrations.set(platform, integration);
    this.logger.log(`Registered integration for ${platform}`);
  }

  // OAuth Authentication
  async authenticateIntegration(campaignId: string, platform: SocialPlatform, credentials: SocialMediaCredentials) {
    const integration = this.integrations.get(platform);
    if (!integration) {
      throw new Error(`Integration not found for platform: ${platform}`);
    }

    try {
      const isAuthenticated = await integration.authenticate(credentials);
      
      if (isAuthenticated) {
        await this.prisma.marketingIntegration.upsert({
          where: {
            campaignId_platform: {
              campaignId,
              platform,
            },
          },
          update: {
            status: IntegrationStatus.ACTIVE,
            credentials,
            lastSyncAt: new Date(),
          },
          create: {
            campaignId,
            platform,
            status: IntegrationStatus.ACTIVE,
            credentials,
            lastSyncAt: new Date(),
          },
        });

        this.logger.log(`Successfully authenticated ${platform} integration for campaign ${campaignId}`);
        return { success: true, message: 'Integration authenticated successfully' };
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      this.logger.error(`Failed to authenticate ${platform} integration: ${error.message}`);
      
      await this.prisma.marketingIntegration.updateMany({
        where: { campaignId, platform },
        data: { status: IntegrationStatus.ERROR },
      });

      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // Post Content to Social Media
  async postContent(contentId: string, platform: SocialPlatform) {
    const content = await this.prisma.marketingContent.findUnique({
      where: { id: contentId },
      include: {
        campaign: {
          include: {
            integrations: {
              where: { platform, status: IntegrationStatus.ACTIVE }
            }
          }
        },
        assets: true,
      },
    });

    if (!content) {
      throw new Error('Content not found');
    }

    const integration = this.integrations.get(platform);
    if (!integration) {
      throw new Error(`Integration not found for platform: ${platform}`);
    }

    const campaignIntegration = content.campaign.integrations[0];
    if (!campaignIntegration) {
      throw new Error(`No active integration found for platform: ${platform}`);
    }

    try {
      const post: SocialMediaPost = {
        id: contentId,
        content: content.title + (content.description ? `\n\n${content.description}` : ''),
        mediaUrls: content.assets.map(asset => asset.url),
        scheduledAt: content.scheduledAt,
        publishedAt: content.publishedAt,
        status: 'draft',
        platform,
        metadata: content.metadata,
      };

      let postId: string;
      if (content.scheduledAt && content.scheduledAt > new Date()) {
        postId = await integration.schedulePost(post, content.scheduledAt);
      } else {
        postId = await integration.postContent(post);
      }

      // Update content status
      await this.prisma.marketingContent.update({
        where: { id: contentId },
        data: {
          status: content.scheduledAt && content.scheduledAt > new Date() ? 'SCHEDULED' : 'PUBLISHED',
          publishedAt: content.scheduledAt && content.scheduledAt > new Date() ? null : new Date(),
          url: postId,
        },
      });

      this.logger.log(`Successfully posted content ${contentId} to ${platform}`);
      return { success: true, postId, message: 'Content posted successfully' };
    } catch (error) {
      this.logger.error(`Failed to post content to ${platform}: ${error.message}`);
      
      await this.prisma.marketingContent.update({
        where: { id: contentId },
        data: { status: 'REJECTED' },
      });

      throw new Error(`Failed to post content: ${error.message}`);
    }
  }

  // Get Analytics
  async getAnalytics(campaignId: string, platform: SocialPlatform, dateRange: { start: Date; end: Date }) {
    const integration = this.integrations.get(platform);
    if (!integration) {
      throw new Error(`Integration not found for platform: ${platform}`);
    }

    const campaignIntegration = await this.prisma.marketingIntegration.findUnique({
      where: {
        campaignId_platform: {
          campaignId,
          platform,
        },
      },
    });

    if (!campaignIntegration || campaignIntegration.status !== IntegrationStatus.ACTIVE) {
      throw new Error(`No active integration found for platform: ${platform}`);
    }

    try {
      const content = await this.prisma.marketingContent.findMany({
        where: {
          campaignId,
          platform: platform.toLowerCase(),
          publishedAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
      });

      const analyticsPromises = content.map(async (item) => {
        if (item.url) {
          return integration.getAnalytics(item.url, dateRange);
        }
        return null;
      });

      const analyticsResults = await Promise.all(analyticsPromises);
      const analytics = analyticsResults.filter(result => result !== null).flat();

      return {
        platform,
        dateRange,
        analytics,
        summary: this.calculateAnalyticsSummary(analytics),
      };
    } catch (error) {
      this.logger.error(`Failed to get analytics for ${platform}: ${error.message}`);
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }

  // Refresh Credentials (OAuth token refresh)
  @Cron(CronExpression.EVERY_HOUR)
  async refreshExpiredCredentials() {
    this.logger.log('Checking for expired credentials...');

    const expiredIntegrations = await this.prisma.marketingIntegration.findMany({
      where: {
        status: IntegrationStatus.ACTIVE,
        credentials: {
          path: ['expiresAt'],
          lt: new Date(),
        },
      },
    });

    for (const integration of expiredIntegrations) {
      try {
        const platformIntegration = this.integrations.get(integration.platform);
        if (!platformIntegration) continue;

        const refreshedCredentials = await platformIntegration.refreshCredentials(
          integration.credentials as SocialMediaCredentials
        );

        await this.prisma.marketingIntegration.update({
          where: { id: integration.id },
          data: {
            credentials: refreshedCredentials,
            lastSyncAt: new Date(),
          },
        });

        this.logger.log(`Refreshed credentials for ${integration.platform} integration ${integration.id}`);
      } catch (error) {
        this.logger.error(`Failed to refresh credentials for ${integration.platform}: ${error.message}`);
        
        await this.prisma.marketingIntegration.update({
          where: { id: integration.id },
          data: { status: IntegrationStatus.EXPIRED },
        });
      }
    }
  }

  // Sync Published Content Status
  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncPublishedContent() {
    this.logger.log('Syncing published content status...');

    const scheduledContent = await this.prisma.marketingContent.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: new Date(),
        },
      },
      include: {
        campaign: {
          include: {
            integrations: {
              where: { status: IntegrationStatus.ACTIVE }
            }
          }
        },
      },
    });

    for (const content of scheduledContent) {
      try {
        // Find the appropriate platform integration
        const platform = this.determinePlatformFromContent(content);
        if (!platform) continue;

        const integration = this.integrations.get(platform);
        if (!integration) continue;

        // Check if content was actually published
        const analytics = await integration.getAnalytics(content.url || content.id, {
          start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          end: new Date(),
        });

        if (analytics && analytics.length > 0) {
          await this.prisma.marketingContent.update({
            where: { id: content.id },
            data: {
              status: 'PUBLISHED',
              publishedAt: new Date(),
            },
          });

          this.logger.log(`Updated content ${content.id} status to PUBLISHED`);
        }
      } catch (error) {
        this.logger.error(`Failed to sync content ${content.id}: ${error.message}`);
      }
    }
  }

  // Helper Methods
  private calculateAnalyticsSummary(analytics: SocialMediaAnalytics[]) {
    return analytics.reduce(
      (summary, data) => ({
        totalImpressions: summary.totalImpressions + data.impressions,
        totalReach: summary.totalReach + data.reach,
        totalEngagement: summary.totalEngagement + data.engagement,
        totalClicks: summary.totalClicks + data.clicks,
        totalShares: summary.totalShares + data.shares,
        totalComments: summary.totalComments + data.comments,
        totalLikes: summary.totalLikes + data.likes,
      }),
      {
        totalImpressions: 0,
        totalReach: 0,
        totalEngagement: 0,
        totalClicks: 0,
        totalShares: 0,
        totalComments: 0,
        totalLikes: 0,
      }
    );
  }

  private determinePlatformFromContent(content: any): SocialPlatform | null {
    // This is a simplified implementation
    // In a real scenario, you might store the target platform with the content
    if (content.campaign.integrations.length > 0) {
      return content.campaign.integrations[0].platform;
    }
    return null;
  }

  // Revoke Integration
  async revokeIntegration(campaignId: string, platform: SocialPlatform) {
    const integration = this.integrations.get(platform);
    if (!integration) {
      throw new Error(`Integration not found for platform: ${platform}`);
    }

    const campaignIntegration = await this.prisma.marketingIntegration.findUnique({
      where: {
        campaignId_platform: {
          campaignId,
          platform,
        },
      },
    });

    if (!campaignIntegration) {
      throw new Error('Integration not found');
    }

    try {
      await integration.revokeAccess(campaignIntegration.credentials as SocialMediaCredentials);
      
      await this.prisma.marketingIntegration.delete({
        where: { id: campaignIntegration.id },
      });

      this.logger.log(`Successfully revoked ${platform} integration for campaign ${campaignId}`);
      return { success: true, message: 'Integration revoked successfully' };
    } catch (error) {
      this.logger.error(`Failed to revoke ${platform} integration: ${error.message}`);
      throw new Error(`Failed to revoke integration: ${error.message}`);
    }
  }
}
