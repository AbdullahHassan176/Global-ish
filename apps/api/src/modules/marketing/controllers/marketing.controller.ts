import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MarketingService } from '../services/marketing.service';
import { SocialIntegrationService } from '../services/social-integration.service';
import { JwtAuthGuard } from '../../../packages/auth/src/guards/jwt-auth.guard';
import { PolicyGuard } from '../../../packages/auth/src/guards/policy.guard';
import { RequirePermission } from '../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../packages/auth/src/decorators/current-user.decorator';
import { 
  CreateCampaignDto, 
  UpdateCampaignDto, 
  CampaignQueryDto,
  CreateContentDto,
  UpdateContentDto,
  ContentQueryDto,
  CreateApprovalDto,
  UpdateApprovalDto,
  CreateAssetDto,
  CreateIntegrationDto,
  UpdateIntegrationDto,
  SocialPlatform
} from '../dto/marketing.dto';

@Controller('marketing')
@UseGuards(JwtAuthGuard, PolicyGuard)
export class MarketingController {
  constructor(
    private readonly marketingService: MarketingService,
    private readonly socialIntegrationService: SocialIntegrationService,
  ) {}

  // Campaign Management
  @Post('campaigns')
  @RequirePermission('marketing:campaigns:create')
  async createCampaign(
    @Body() createCampaignDto: CreateCampaignDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.createCampaign(createCampaignDto, user.id);
  }

  @Get('campaigns')
  @RequirePermission('marketing:campaigns:read')
  async getCampaigns(
    @Query() query: CampaignQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.getCampaigns(query, user.id);
  }

  @Get('campaigns/:id')
  @RequirePermission('marketing:campaigns:read')
  async getCampaignById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.getCampaignById(id, user.id);
  }

  @Put('campaigns/:id')
  @RequirePermission('marketing:campaigns:update')
  async updateCampaign(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.updateCampaign(id, updateCampaignDto, user.id);
  }

  @Delete('campaigns/:id')
  @RequirePermission('marketing:campaigns:delete')
  async deleteCampaign(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.deleteCampaign(id, user.id);
  }

  // Content Management
  @Post('content')
  @RequirePermission('marketing:content:create')
  async createContent(
    @Body() createContentDto: CreateContentDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.createContent(createContentDto, user.id);
  }

  @Get('content')
  @RequirePermission('marketing:content:read')
  async getContent(
    @Query() query: ContentQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.getContent(query, user.id);
  }

  @Get('content/:id')
  @RequirePermission('marketing:content:read')
  async getContentById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.getContentById(id, user.id);
  }

  @Put('content/:id')
  @RequirePermission('marketing:content:update')
  async updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.updateContent(id, updateContentDto, user.id);
  }

  @Delete('content/:id')
  @RequirePermission('marketing:content:delete')
  async deleteContent(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.deleteContent(id, user.id);
  }

  // Approval Management
  @Post('approvals')
  @RequirePermission('marketing:approvals:create')
  async createApproval(
    @Body() createApprovalDto: CreateApprovalDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.createApproval(createApprovalDto, user.id);
  }

  @Put('approvals/:id')
  @RequirePermission('marketing:approvals:update')
  async updateApproval(
    @Param('id') id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.updateApproval(id, updateApprovalDto, user.id);
  }

  // Asset Management
  @Post('assets')
  @RequirePermission('marketing:assets:create')
  async createAsset(
    @Body() createAssetDto: CreateAssetDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.createAsset(createAssetDto, user.id);
  }

  @Get('content/:contentId/assets')
  @RequirePermission('marketing:assets:read')
  async getAssetsByContentId(
    @Param('contentId') contentId: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.getAssetsByContentId(contentId, user.id);
  }

  @Delete('assets/:id')
  @RequirePermission('marketing:assets:delete')
  async deleteAsset(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.deleteAsset(id, user.id);
  }

  // Integration Management
  @Post('integrations')
  @RequirePermission('marketing:integrations:create')
  async createIntegration(
    @Body() createIntegrationDto: CreateIntegrationDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.createIntegration(createIntegrationDto, user.id);
  }

  @Get('campaigns/:campaignId/integrations')
  @RequirePermission('marketing:integrations:read')
  async getIntegrationsByCampaignId(
    @Param('campaignId') campaignId: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.getIntegrationsByCampaignId(campaignId, user.id);
  }

  @Put('integrations/:id')
  @RequirePermission('marketing:integrations:update')
  async updateIntegration(
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.updateIntegration(id, updateIntegrationDto, user.id);
  }

  @Delete('integrations/:id')
  @RequirePermission('marketing:integrations:delete')
  async deleteIntegration(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.deleteIntegration(id, user.id);
  }

  // Social Media Integration
  @Post('integrations/:campaignId/:platform/authenticate')
  @RequirePermission('marketing:integrations:authenticate')
  async authenticateIntegration(
    @Param('campaignId') campaignId: string,
    @Param('platform') platform: SocialPlatform,
    @Body() credentials: any,
    @CurrentUser() user: any,
  ) {
    return this.socialIntegrationService.authenticateIntegration(
      campaignId,
      platform,
      credentials,
    );
  }

  @Post('content/:contentId/publish/:platform')
  @RequirePermission('marketing:content:publish')
  async publishContent(
    @Param('contentId') contentId: string,
    @Param('platform') platform: SocialPlatform,
    @CurrentUser() user: any,
  ) {
    return this.socialIntegrationService.postContent(contentId, platform);
  }

  @Get('campaigns/:campaignId/analytics/:platform')
  @RequirePermission('marketing:analytics:read')
  async getAnalytics(
    @Param('campaignId') campaignId: string,
    @Param('platform') platform: SocialPlatform,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: any,
  ) {
    const dateRange = {
      start: new Date(startDate),
      end: new Date(endDate),
    };
    return this.socialIntegrationService.getAnalytics(campaignId, platform, dateRange);
  }

  @Delete('integrations/:campaignId/:platform/revoke')
  @RequirePermission('marketing:integrations:revoke')
  async revokeIntegration(
    @Param('campaignId') campaignId: string,
    @Param('platform') platform: SocialPlatform,
    @CurrentUser() user: any,
  ) {
    return this.socialIntegrationService.revokeIntegration(campaignId, platform);
  }

  // Analytics and Reporting
  @Get('campaigns/:id/analytics')
  @RequirePermission('marketing:analytics:read')
  async getCampaignAnalytics(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.getCampaignAnalytics(id, user.id);
  }

  @Get('campaigns/:id/calendar')
  @RequirePermission('marketing:calendar:read')
  async getContentCalendar(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: any,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.marketingService.getContentCalendar(id, start, end, user.id);
  }
}
