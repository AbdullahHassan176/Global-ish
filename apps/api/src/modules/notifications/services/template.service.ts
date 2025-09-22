import { Injectable, Logger } from '@nestjs/common';
import { NotificationTemplate } from '../interfaces/notification.interface';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private templates: Map<string, NotificationTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  async getTemplate(type: string, channel: string): Promise<NotificationTemplate> {
    const key = `${type}_${channel}`;
    let template = this.templates.get(key);

    if (!template) {
      // Return default template if specific one not found
      template = this.templates.get(`default_${channel}`) || this.getFallbackTemplate(type, channel);
    }

    return template;
  }

  async renderTemplate(template: NotificationTemplate, data: Record<string, any>): Promise<{
    subject?: string;
    html: string;
    text: string;
  }> {
    try {
      let html = template.template;
      let text = template.template;
      let subject = template.subject;

      // Replace variables in template
      for (const variable of template.variables) {
        const value = this.getNestedValue(data, variable) || `{{${variable}}}`;
        const regex = new RegExp(`{{\\s*${variable}\\s*}}`, 'g');
        
        html = html.replace(regex, String(value));
        text = text.replace(regex, String(value));
        
        if (subject) {
          subject = subject.replace(regex, String(value));
        }
      }

      // Convert HTML to text if needed
      if (html !== text) {
        text = this.htmlToText(html);
      }

      return {
        subject,
        html,
        text
      };
    } catch (error) {
      this.logger.error('Template rendering failed', error);
      throw error;
    }
  }

  private initializeDefaultTemplates(): void {
    // Default email templates
    this.templates.set('default_email', {
      id: 'default_email',
      name: 'Default Email Template',
      type: 'INFO' as any,
      channel: 'email' as any,
      subject: '{{title}}',
      template: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>{{title}}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>{{title}}</h1>
            </div>
            <div class="content">
              <p>Hello {{userName}},</p>
              <p>{{message}}</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Global Next Portal.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      variables: ['title', 'message', 'userName'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Task assigned email template
    this.templates.set('TASK_ASSIGNED_email', {
      id: 'TASK_ASSIGNED_email',
      name: 'Task Assigned Email Template',
      type: 'TASK_ASSIGNED' as any,
      channel: 'email' as any,
      subject: 'New Task Assigned: {{title}}',
      template: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Task Assigned</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .task-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Task Assigned</h1>
            </div>
            <div class="content">
              <p>Hello {{userName}},</p>
              <p>You have been assigned a new task:</p>
              <div class="task-details">
                <h3>{{title}}</h3>
                <p><strong>Description:</strong> {{message}}</p>
                {{#if data.dueDate}}
                <p><strong>Due Date:</strong> {{data.dueDate}}</p>
                {{/if}}
                {{#if data.priority}}
                <p><strong>Priority:</strong> {{data.priority}}</p>
                {{/if}}
              </div>
              <p>Please log in to the portal to view and work on this task.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Global Next Portal.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      variables: ['title', 'message', 'userName', 'data.dueDate', 'data.priority'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Approval required email template
    this.templates.set('APPROVAL_REQUIRED_email', {
      id: 'APPROVAL_REQUIRED_email',
      name: 'Approval Required Email Template',
      type: 'APPROVAL_REQUIRED' as any,
      channel: 'email' as any,
      subject: 'Approval Required: {{title}}',
      template: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Approval Required</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ffc107; color: #333; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .approval-details { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }
            .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Approval Required</h1>
            </div>
            <div class="content">
              <p>Hello {{userName}},</p>
              <p>Your approval is required for the following:</p>
              <div class="approval-details">
                <h3>{{title}}</h3>
                <p>{{message}}</p>
                {{#if data.workflowInstanceId}}
                <p><strong>Workflow Instance:</strong> {{data.workflowInstanceId}}</p>
                {{/if}}
                {{#if data.stepName}}
                <p><strong>Step:</strong> {{data.stepName}}</p>
                {{/if}}
              </div>
              <p>Please log in to the portal to review and approve this request.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Global Next Portal.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      variables: ['title', 'message', 'userName', 'data.workflowInstanceId', 'data.stepName'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Default SMS template
    this.templates.set('default_sms', {
      id: 'default_sms',
      name: 'Default SMS Template',
      type: 'INFO' as any,
      channel: 'sms' as any,
      template: '{{title}}: {{message}}',
      variables: ['title', 'message'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  private getFallbackTemplate(type: string, channel: string): NotificationTemplate {
    return {
      id: `fallback_${type}_${channel}`,
      name: `Fallback ${type} ${channel} Template`,
      type: type as any,
      channel: channel as any,
      subject: '{{title}}',
      template: '{{message}}',
      variables: ['title', 'message'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }
}
