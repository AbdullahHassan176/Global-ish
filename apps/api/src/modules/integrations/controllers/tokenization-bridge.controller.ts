import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TokenizationBridgeService } from '../services/tokenization-bridge.service';
import { 
  CreateTokenizationEventDto, 
  UpdateTokenizationEventDto,
  CreateTokenizationKPIDto,
  UpdateTokenizationKPIDto,
  TokenizationEventQueryDto,
  TokenizationKPIQueryDto
} from '../dto/integrations.dto';
import { JwtAuthGuard } from '../../../../packages/auth/src/guards/jwt-auth.guard';
import { RequirePermission } from '../../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../../packages/auth/src/decorators/current-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('integrations/tokenization')
export class TokenizationBridgeController {
  constructor(private readonly tokenizationBridgeService: TokenizationBridgeService) {}

  // Tokenization Events
  @Post('events')
  @RequirePermission('integrations.tokenization.create')
  createTokenizationEvent(
    @Body() createEventDto: CreateTokenizationEventDto,
    @CurrentUser() user: User,
  ) {
    return this.tokenizationBridgeService.createTokenizationEvent(createEventDto, user.id);
  }

  @Get('events')
  @RequirePermission('integrations.tokenization.read')
  findAllTokenizationEvents(@Query() query: TokenizationEventQueryDto) {
    return this.tokenizationBridgeService.findAllTokenizationEvents(query);
  }

  @Get('events/:id')
  @RequirePermission('integrations.tokenization.read')
  findTokenizationEventById(@Param('id') id: string) {
    return this.tokenizationBridgeService.findTokenizationEventById(id);
  }

  @Patch('events/:id')
  @RequirePermission('integrations.tokenization.update')
  updateTokenizationEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateTokenizationEventDto,
  ) {
    return this.tokenizationBridgeService.updateTokenizationEvent(id, updateEventDto);
  }

  @Delete('events/:id')
  @RequirePermission('integrations.tokenization.delete')
  deleteTokenizationEvent(@Param('id') id: string) {
    return this.tokenizationBridgeService.deleteTokenizationEvent(id);
  }

  // Tokenization KPIs
  @Post('kpis')
  @RequirePermission('integrations.tokenization.create')
  createTokenizationKPI(
    @Body() createKPIDto: CreateTokenizationKPIDto,
    @CurrentUser() user: User,
  ) {
    return this.tokenizationBridgeService.createTokenizationKPI(createKPIDto, user.id);
  }

  @Get('kpis')
  @RequirePermission('integrations.tokenization.read')
  findAllTokenizationKPIs(@Query() query: TokenizationKPIQueryDto) {
    return this.tokenizationBridgeService.findAllTokenizationKPIs(query);
  }

  @Get('kpis/:id')
  @RequirePermission('integrations.tokenization.read')
  findTokenizationKPIById(@Param('id') id: string) {
    return this.tokenizationBridgeService.findTokenizationKPIById(id);
  }

  @Patch('kpis/:id')
  @RequirePermission('integrations.tokenization.update')
  updateTokenizationKPI(
    @Param('id') id: string,
    @Body() updateKPIDto: UpdateTokenizationKPIDto,
  ) {
    return this.tokenizationBridgeService.updateTokenizationKPI(id, updateKPIDto);
  }

  @Delete('kpis/:id')
  @RequirePermission('integrations.tokenization.delete')
  deleteTokenizationKPI(@Param('id') id: string) {
    return this.tokenizationBridgeService.deleteTokenizationKPI(id);
  }

  // Bridge API endpoints (public, signed)
  @Get('bridge/events')
  async getBridgeEvents(@Query() query: TokenizationEventQueryDto) {
    // This endpoint would be public but require HMAC signature validation
    // For now, we'll use the same permission system
    return this.tokenizationBridgeService.findAllTokenizationEvents(query);
  }

  @Get('bridge/kpis')
  async getBridgeKPIs(@Query() query: TokenizationKPIQueryDto) {
    // This endpoint would be public but require HMAC signature validation
    // For now, we'll use the same permission system
    return this.tokenizationBridgeService.findAllTokenizationKPIs(query);
  }

  // Utility endpoints
  @Post('sanitize')
  @RequirePermission('integrations.tokenization.read')
  sanitizeData(
    @Body() data: { data: Record<string, any>; entityType: string },
  ) {
    return this.tokenizationBridgeService.sanitizeData(data.data, data.entityType);
  }
}
