import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignQueryDto, CreateContentDto, UpdateContentDto, ContentQueryDto, CreateApprovalDto, UpdateApprovalDto, CreateAssetDto, CreateIntegrationDto, UpdateIntegrationDto } from '../dto/marketing.dto';
import { CampaignStatus, ContentStatus, ApprovalStatus, IntegrationStatus } from '../dto/marketing.dto';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  // Campaign Management
  async createCampaign(createCampaignDto: CreateCampaignDto, userId: string) {
    return this.prisma.marketingCampaign.create({
      data: {
        ...createCampaignDto,
        createdBy: userId,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        content: true,
        integrations: true,
      },
    });
  }

  async getCampaigns(query: CampaignQueryDto, userId: string) {
    const { status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [campaigns, total] = await Promise.all([
      this.prisma.marketingCampaign.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          content: {
            select: { id: true, title: true, status: true, type: true }
          },
          integrations: {
            select: { id: true, platform: true, status: true }
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.marketingCampaign.count({ where }),
    ]);

    return {
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getCampaignById(id: string, userId: string) {
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        content: {
          include: {
            creator: {
              select: { id: true, name: true, email: true }
            },
            approvals: {
              include: {
                approver: {
                  select: { id: true, name: true, email: true }
                }
              }
            },
            assets: true,
          }
        },
        integrations: true,
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, email: true }
            }
          }
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async updateCampaign(id: string, updateCampaignDto: UpdateCampaignDto, userId: string) {
    const campaign = await this.getCampaignById(id, userId);
    
    return this.prisma.marketingCampaign.update({
      where: { id },
      data: updateCampaignDto,
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        content: true,
        integrations: true,
      },
    });
  }

  async deleteCampaign(id: string, userId: string) {
    const campaign = await this.getCampaignById(id, userId);
    
    return this.prisma.marketingCampaign.delete({
      where: { id },
    });
  }

  // Content Management
  async createContent(createContentDto: CreateContentDto, userId: string) {
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id: createContentDto.campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return this.prisma.marketingContent.create({
      data: {
        ...createContentDto,
        createdBy: userId,
      },
      include: {
        campaign: true,
        creator: {
          select: { id: true, name: true, email: true }
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        assets: true,
      },
    });
  }

  async getContent(query: ContentQueryDto, userId: string) {
    const { campaignId, type, status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (campaignId) where.campaignId = campaignId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [content, total] = await Promise.all([
      this.prisma.marketingContent.findMany({
        where,
        skip,
        take: limit,
        include: {
          campaign: {
            select: { id: true, name: true, status: true }
          },
          creator: {
            select: { id: true, name: true, email: true }
          },
          approvals: {
            include: {
              approver: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          assets: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.marketingContent.count({ where }),
    ]);

    return {
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getContentById(id: string, userId: string) {
    const content = await this.prisma.marketingContent.findUnique({
      where: { id },
      include: {
        campaign: true,
        creator: {
          select: { id: true, name: true, email: true }
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        assets: true,
      },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async updateContent(id: string, updateContentDto: UpdateContentDto, userId: string) {
    const content = await this.getContentById(id, userId);
    
    return this.prisma.marketingContent.update({
      where: { id },
      data: updateContentDto,
      include: {
        campaign: true,
        creator: {
          select: { id: true, name: true, email: true }
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        assets: true,
      },
    });
  }

  async deleteContent(id: string, userId: string) {
    const content = await this.getContentById(id, userId);
    
    return this.prisma.marketingContent.delete({
      where: { id },
    });
  }

  // Approval Management
  async createApproval(createApprovalDto: CreateApprovalDto, userId: string) {
    const content = await this.prisma.marketingContent.findUnique({
      where: { id: createApprovalDto.contentId },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const existingApproval = await this.prisma.marketingApproval.findUnique({
      where: {
        contentId_approverId: {
          contentId: createApprovalDto.contentId,
          approverId: createApprovalDto.approverId,
        },
      },
    });

    if (existingApproval) {
      throw new BadRequestException('Approval already exists for this content and approver');
    }

    return this.prisma.marketingApproval.create({
      data: createApprovalDto,
      include: {
        content: true,
        campaign: true,
        approver: {
          select: { id: true, name: true, email: true }
        },
      },
    });
  }

  async updateApproval(id: string, updateApprovalDto: UpdateApprovalDto, userId: string) {
    const approval = await this.prisma.marketingApproval.findUnique({
      where: { id },
    });

    if (!approval) {
      throw new NotFoundException('Approval not found');
    }

    const updateData: any = { ...updateApprovalDto };
    if (updateApprovalDto.status === ApprovalStatus.APPROVED) {
      updateData.approvedAt = new Date();
    }

    return this.prisma.marketingApproval.update({
      where: { id },
      data: updateData,
      include: {
        content: true,
        campaign: true,
        approver: {
          select: { id: true, name: true, email: true }
        },
      },
    });
  }

  // Asset Management
  async createAsset(createAssetDto: CreateAssetDto, userId: string) {
    const content = await this.prisma.marketingContent.findUnique({
      where: { id: createAssetDto.contentId },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return this.prisma.marketingAsset.create({
      data: createAssetDto,
      include: {
        content: true,
      },
    });
  }

  async getAssetsByContentId(contentId: string, userId: string) {
    return this.prisma.marketingAsset.findMany({
      where: { contentId },
      include: {
        content: {
          select: { id: true, title: true, type: true }
        },
      },
    });
  }

  async deleteAsset(id: string, userId: string) {
    return this.prisma.marketingAsset.delete({
      where: { id },
    });
  }

  // Integration Management
  async createIntegration(createIntegrationDto: CreateIntegrationDto, userId: string) {
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id: createIntegrationDto.campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const existingIntegration = await this.prisma.marketingIntegration.findUnique({
      where: {
        campaignId_platform: {
          campaignId: createIntegrationDto.campaignId,
          platform: createIntegrationDto.platform,
        },
      },
    });

    if (existingIntegration) {
      throw new BadRequestException('Integration already exists for this campaign and platform');
    }

    return this.prisma.marketingIntegration.create({
      data: createIntegrationDto,
      include: {
        campaign: true,
      },
    });
  }

  async getIntegrationsByCampaignId(campaignId: string, userId: string) {
    return this.prisma.marketingIntegration.findMany({
      where: { campaignId },
      include: {
        campaign: {
          select: { id: true, name: true, status: true }
        },
      },
    });
  }

  async updateIntegration(id: string, updateIntegrationDto: UpdateIntegrationDto, userId: string) {
    const integration = await this.prisma.marketingIntegration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return this.prisma.marketingIntegration.update({
      where: { id },
      data: updateIntegrationDto,
      include: {
        campaign: true,
      },
    });
  }

  async deleteIntegration(id: string, userId: string) {
    return this.prisma.marketingIntegration.delete({
      where: { id },
    });
  }

  // Analytics and Reporting
  async getCampaignAnalytics(campaignId: string, userId: string) {
    const campaign = await this.getCampaignById(campaignId, userId);
    
    const contentStats = await this.prisma.marketingContent.groupBy({
      by: ['status', 'type'],
      where: { campaignId },
      _count: { id: true },
    });

    const approvalStats = await this.prisma.marketingApproval.groupBy({
      by: ['status'],
      where: { campaignId },
      _count: { id: true },
    });

    return {
      campaign,
      contentStats,
      approvalStats,
    };
  }

  async getContentCalendar(campaignId: string, startDate: Date, endDate: Date, userId: string) {
    return this.prisma.marketingContent.findMany({
      where: {
        campaignId,
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, email: true }
            }
          }
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
