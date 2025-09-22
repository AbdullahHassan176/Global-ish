import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { 
  CreateProductRegistrationDto, 
  UpdateProductRegistrationDto, 
  ProductRegistrationQueryDto,
  CreateChecklistItemDto,
  UpdateChecklistItemDto,
  BulkUpdateChecklistDto,
  CreateDocumentDto,
  UpdateDocumentDto,
  CreateSubmissionDto,
  UpdateSubmissionDto,
  CreateCommunicationDto,
  UpdateCommunicationDto,
  GenerateDocumentDto,
  DocumentTemplateDto,
  ExpiryAlertDto,
  RegistrationStatus,
  DocumentType,
  SubmissionStatus
} from '../dto/product-registration.dto';

@Injectable()
export class ProductRegistrationService {
  constructor(private prisma: PrismaService) {}

  // Product Registration Management
  async createRegistration(createDto: CreateProductRegistrationDto, userId: string) {
    return this.prisma.productRegistration.create({
      data: {
        ...createDto,
        createdBy: userId,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        checklist: {
          orderBy: { order: 'asc' }
        },
        documents: true,
        submissions: true,
        communications: {
          orderBy: { createdAt: 'desc' }
        },
      },
    });
  }

  async getRegistrations(query: ProductRegistrationQueryDto, userId: string) {
    const { status, country, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (country) where.country = country;
    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { productCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [registrations, total] = await Promise.all([
      this.prisma.productRegistration.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          checklist: {
            orderBy: { order: 'asc' }
          },
          documents: true,
          submissions: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.productRegistration.count({ where }),
    ]);

    return {
      registrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getRegistrationById(id: string, userId: string) {
    const registration = await this.prisma.productRegistration.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        checklist: {
          orderBy: { order: 'asc' }
        },
        documents: true,
        submissions: {
          include: {
            creator: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        communications: {
          include: {
            creator: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    if (!registration) {
      throw new NotFoundException('Product registration not found');
    }

    return registration;
  }

  async updateRegistration(id: string, updateDto: UpdateProductRegistrationDto, userId: string) {
    const registration = await this.getRegistrationById(id, userId);
    
    return this.prisma.productRegistration.update({
      where: { id },
      data: updateDto,
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        checklist: {
          orderBy: { order: 'asc' }
        },
        documents: true,
        submissions: true,
        communications: {
          orderBy: { createdAt: 'desc' }
        },
      },
    });
  }

  async deleteRegistration(id: string, userId: string) {
    const registration = await this.getRegistrationById(id, userId);
    
    return this.prisma.productRegistration.delete({
      where: { id },
    });
  }

  // Checklist Management
  async createChecklistItem(registrationId: string, createDto: CreateChecklistItemDto, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    const maxOrder = await this.prisma.productChecklist.aggregate({
      where: { registrationId },
      _max: { order: true },
    });

    return this.prisma.productChecklist.create({
      data: {
        ...createDto,
        registrationId,
        order: createDto.order || (maxOrder._max.order || 0) + 1,
      },
    });
  }

  async getChecklist(registrationId: string, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    return this.prisma.productChecklist.findMany({
      where: { registrationId },
      orderBy: { order: 'asc' },
    });
  }

  async updateChecklistItem(id: string, updateDto: UpdateChecklistItemDto, userId: string) {
    const item = await this.prisma.productChecklist.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Checklist item not found');
    }

    const updateData: any = { ...updateDto };
    if (updateDto.isCompleted && !item.isCompleted) {
      updateData.completedAt = new Date();
      updateData.completedBy = userId;
    } else if (!updateDto.isCompleted && item.isCompleted) {
      updateData.completedAt = null;
      updateData.completedBy = null;
    }

    return this.prisma.productChecklist.update({
      where: { id },
      data: updateData,
    });
  }

  async bulkUpdateChecklist(registrationId: string, bulkUpdateDto: BulkUpdateChecklistDto, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    const updatePromises = bulkUpdateDto.items.map(item => {
      const updateData: any = { ...item };
      if (item.isCompleted !== undefined) {
        updateData.completedAt = item.isCompleted ? new Date() : null;
        updateData.completedBy = item.isCompleted ? userId : null;
      }
      
      return this.prisma.productChecklist.update({
        where: { id: item.id },
        data: updateData,
      });
    });

    return Promise.all(updatePromises);
  }

  async deleteChecklistItem(id: string, userId: string) {
    return this.prisma.productChecklist.delete({
      where: { id },
    });
  }

  // Document Management
  async createDocument(registrationId: string, createDto: CreateDocumentDto, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    return this.prisma.productDocument.create({
      data: {
        ...createDto,
        registrationId,
      },
    });
  }

  async getDocuments(registrationId: string, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    return this.prisma.productDocument.findMany({
      where: { registrationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateDocument(id: string, updateDto: UpdateDocumentDto, userId: string) {
    const document = await this.prisma.productDocument.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.productDocument.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteDocument(id: string, userId: string) {
    return this.prisma.productDocument.delete({
      where: { id },
    });
  }

  // Document Generation
  async generateDocument(registrationId: string, generateDto: GenerateDocumentDto, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    // This would integrate with a document generation service
    // For now, we'll create a placeholder document
    const generatedDocument = await this.prisma.productDocument.create({
      data: {
        registrationId,
        name: `Generated Document - ${new Date().toISOString()}`,
        type: DocumentType.APPLICATION,
        url: `/generated-documents/${registrationId}/${Date.now()}.pdf`,
        isGenerated: true,
        generatedAt: new Date(),
      },
    });

    return generatedDocument;
  }

  // Submission Management
  async createSubmission(registrationId: string, createDto: CreateSubmissionDto, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    return this.prisma.productSubmission.create({
      data: {
        ...createDto,
        registrationId,
        createdBy: userId,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
      },
    });
  }

  async getSubmissions(registrationId: string, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    return this.prisma.productSubmission.findMany({
      where: { registrationId },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateSubmission(id: string, updateDto: UpdateSubmissionDto, userId: string) {
    const submission = await this.prisma.productSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const updateData: any = { ...updateDto };
    if (updateDto.status === SubmissionStatus.SUBMITTED && submission.status !== SubmissionStatus.SUBMITTED) {
      updateData.submittedAt = new Date();
    }

    return this.prisma.productSubmission.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
    });
  }

  async deleteSubmission(id: string, userId: string) {
    return this.prisma.productSubmission.delete({
      where: { id },
    });
  }

  // Communication Management
  async createCommunication(registrationId: string, createDto: CreateCommunicationDto, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    return this.prisma.productCommunication.create({
      data: {
        ...createDto,
        registrationId,
        createdBy: userId,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
    });
  }

  async getCommunications(registrationId: string, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    return this.prisma.productCommunication.findMany({
      where: { registrationId },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCommunication(id: string, updateDto: UpdateCommunicationDto, userId: string) {
    const communication = await this.prisma.productCommunication.findUnique({
      where: { id },
    });

    if (!communication) {
      throw new NotFoundException('Communication not found');
    }

    return this.prisma.productCommunication.update({
      where: { id },
      data: updateDto,
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
    });
  }

  async deleteCommunication(id: string, userId: string) {
    return this.prisma.productCommunication.delete({
      where: { id },
    });
  }

  // Analytics and Reporting
  async getRegistrationAnalytics(registrationId: string, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    
    const checklistStats = await this.prisma.productChecklist.groupBy({
      by: ['isCompleted', 'isRequired'],
      where: { registrationId },
      _count: { id: true },
    });

    const submissionStats = await this.prisma.productSubmission.groupBy({
      by: ['status'],
      where: { registrationId },
      _count: { id: true },
    });

    const documentStats = await this.prisma.productDocument.groupBy({
      by: ['type', 'isGenerated'],
      where: { registrationId },
      _count: { id: true },
    });

    return {
      registration,
      checklistStats,
      submissionStats,
      documentStats,
    };
  }

  // Expiry Management
  async getExpiringRegistrations(daysBeforeExpiry: number = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysBeforeExpiry);

    return this.prisma.productRegistration.findMany({
      where: {
        expiresAt: {
          lte: expiryDate,
          gte: new Date(),
        },
        status: {
          in: [RegistrationStatus.APPROVED, RegistrationStatus.SUBMITTED],
        },
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
      },
    });
  }

  async createExpiryAlert(alertDto: ExpiryAlertDto, userId: string) {
    const registration = await this.getRegistrationById(alertDto.registrationId, userId);
    
    // This would integrate with the notification system
    // For now, we'll create a communication record
    return this.prisma.productCommunication.create({
      data: {
        registrationId: alertDto.registrationId,
        type: 'EMAIL',
        subject: `Expiry Alert: ${registration.productName}`,
        content: alertDto.message || `Product registration for ${registration.productName} expires in ${alertDto.daysBeforeExpiry} days.`,
        direction: 'OUTBOUND',
        sentAt: new Date(),
        createdBy: userId,
      },
    });
  }

  // Country-specific Requirements
  async getCountryRequirements(country: string) {
    // This would typically come from a configuration or external service
    const requirements = {
      'US': [
        { item: 'FDA Application', description: 'Food and Drug Administration application', isRequired: true },
        { item: 'Safety Testing', description: 'Product safety testing results', isRequired: true },
        { item: 'Labeling Review', description: 'Product labeling compliance review', isRequired: true },
      ],
      'EU': [
        { item: 'CE Marking', description: 'Conformité Européenne marking', isRequired: true },
        { item: 'Technical Documentation', description: 'Technical documentation package', isRequired: true },
        { item: 'Declaration of Conformity', description: 'EU Declaration of Conformity', isRequired: true },
      ],
      'CA': [
        { item: 'Health Canada Application', description: 'Health Canada product application', isRequired: true },
        { item: 'Safety Assessment', description: 'Product safety assessment', isRequired: true },
        { item: 'Bilingual Labeling', description: 'English and French labeling', isRequired: true },
      ],
    };

    return requirements[country] || [];
  }

  async generateCountryChecklist(registrationId: string, country: string, userId: string) {
    const registration = await this.getRegistrationById(registrationId, userId);
    const requirements = await this.getCountryRequirements(country);
    
    const checklistItems = requirements.map((req, index) => ({
      registrationId,
      item: req.item,
      description: req.description,
      isRequired: req.isRequired,
      isCompleted: false,
      order: index + 1,
    }));

    return this.prisma.productChecklist.createMany({
      data: checklistItems,
    });
  }
}
