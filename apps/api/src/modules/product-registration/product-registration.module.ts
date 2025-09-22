import { Module } from '@nestjs/common';
import { ProductRegistrationController } from './controllers/product-registration.controller';
import { ProductRegistrationService } from './services/product-registration.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductRegistrationController],
  providers: [ProductRegistrationService],
  exports: [ProductRegistrationService],
})
export class ProductRegistrationModule {}
