import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CredentialVaultService } from '../services/credential-vault.service';
import { 
  CreateIntegrationCredentialDto, 
  UpdateIntegrationCredentialDto,
  TestCredentialDto
} from '../dto/integrations.dto';
import { JwtAuthGuard } from '../../../../packages/auth/src/guards/jwt-auth.guard';
import { RequirePermission } from '../../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../../packages/auth/src/decorators/current-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('integrations/credentials')
export class CredentialVaultController {
  constructor(private readonly credentialVaultService: CredentialVaultService) {}

  @Post()
  @RequirePermission('integrations.credential.create')
  createCredential(
    @Body() createCredentialDto: CreateIntegrationCredentialDto,
    @CurrentUser() user: User,
  ) {
    return this.credentialVaultService.createCredential(createCredentialDto, user.id);
  }

  @Get()
  @RequirePermission('integrations.credential.read')
  findAllCredentials(@CurrentUser() user: User) {
    return this.credentialVaultService.findAllCredentials(user.id);
  }

  @Get(':id')
  @RequirePermission('integrations.credential.read')
  findCredentialById(@Param('id') id: string) {
    return this.credentialVaultService.findCredentialById(id);
  }

  @Patch(':id')
  @RequirePermission('integrations.credential.update')
  updateCredential(
    @Param('id') id: string,
    @Body() updateCredentialDto: UpdateIntegrationCredentialDto,
  ) {
    return this.credentialVaultService.updateCredential(id, updateCredentialDto);
  }

  @Delete(':id')
  @RequirePermission('integrations.credential.delete')
  deleteCredential(@Param('id') id: string) {
    return this.credentialVaultService.deleteCredential(id);
  }

  @Get(':id/decrypted')
  @RequirePermission('integrations.credential.read')
  getDecryptedCredentials(@Param('id') id: string) {
    return this.credentialVaultService.getDecryptedCredentials(id);
  }

  @Post('test')
  @RequirePermission('integrations.credential.test')
  testCredential(@Body() testCredentialDto: TestCredentialDto) {
    return this.credentialVaultService.testCredential(testCredentialDto.credentialId);
  }

  @Post(':id/refresh')
  @RequirePermission('integrations.credential.update')
  refreshOAuth2Credential(@Param('id') id: string) {
    return this.credentialVaultService.refreshOAuth2Credential(id);
  }
}
