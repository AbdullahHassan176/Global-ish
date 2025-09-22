# Global Next Unified Portal - AI Assistant Guide

## Project Overview
**Global Next: Consulting, Compliance & Containers in One Portal**

A comprehensive unified portal combining internal operations platform and logistics tracking system for Global Next. The platform serves as a central hub for consulting services, compliance management, and container tracking operations.

## Architecture & Key Technologies
- **Frontend**: HTML5, Tailwind CSS, JavaScript (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Inter (Google Fonts)
- **Design System**: Tailwind CSS with custom components
- **Responsive**: Mobile-first approach with breakpoint optimization

## Directory Structure
```
Global-ish/
├── ai.md                          # This file - project documentation
├── index.html                     # Main dashboard/homepage
├── consulting/
│   ├── forms.html                 # Forms management
│   ├── timesheets.html           # Time tracking & billing
│   └── document-vault.html       # Document repository
├── logistics/
│   ├── tracking.html             # Container tracking
│   ├── documents.html            # Shipping documents
│   └── compliance.html           # Customs compliance
├── compliance/
│   ├── alerts.html               # Compliance alerts
│   ├── licenses.html             # License management
│   └── contracts.html            # Contract repository
├── hr-finance/
│   ├── forms.html                # HR & Finance forms
│   ├── payroll.html              # Payroll management
│   └── reports.html              # Financial reports
├── assets/
│   ├── css/
│   │   └── custom.css            # Custom styles
│   ├── js/
│   │   └── main.js               # Main JavaScript functionality
│   └── images/                   # Project images and icons
└── README.md                     # Project documentation
```

## Key Components & Relationships

### 1. Navigation System
- **Header**: Global Next branding, search, notifications, user profile
- **Main Navigation**: Dashboard, Logistics, Consulting, Compliance, HR & Finance, Analytics
- **Sidebar Navigation**: Module-specific navigation (contextual)

### 2. Dashboard Components
- **KPI Cards**: Active shipments, consulting projects, compliance alerts, revenue
- **Recent Activity**: Real-time updates across all modules
- **Quick Actions**: Common tasks and shortcuts
- **Critical Alerts**: Urgent items requiring attention

### 3. Module Structure
Each module follows consistent patterns:
- **Overview/Summary**: Key metrics and status
- **Data Tables**: Sortable, filterable, paginated
- **Forms**: Consistent styling and validation
- **Sidebar**: Contextual navigation and filters

## Development Guidelines & Conventions

### Code Standards
- **HTML**: Semantic markup, accessibility attributes
- **CSS**: Tailwind utility classes, custom components in separate files
- **JavaScript**: ES6+ features, modular approach
- **Naming**: kebab-case for files, camelCase for variables

### Component Patterns
- **Cards**: Consistent padding (p-6), rounded corners (rounded-xl), shadows
- **Buttons**: Primary (bg-blue-600), secondary (border), consistent sizing
- **Forms**: Focus states, validation styling, consistent spacing
- **Tables**: Hover states, alternating rows, action buttons

### Color Scheme
- **Primary**: Blue (#2563eb) - main actions and branding
- **Secondary**: Purple (#7c3aed) - consulting services
- **Success**: Green (#059669) - completed/approved states
- **Warning**: Orange (#ea580c) - pending/attention needed
- **Error**: Red (#dc2626) - errors/critical alerts
- **Neutral**: Gray scale for text and backgrounds

## Environment Configuration
- **Development**: Local file serving, no build process required
- **Production**: Static file hosting, CDN for external resources
- **Dependencies**: External CDN resources (Tailwind, Font Awesome, Google Fonts)

## Error Handling Approach
- **Form Validation**: Client-side validation with visual feedback
- **API Errors**: Graceful degradation, user-friendly error messages
- **Loading States**: Skeleton screens and loading indicators
- **Offline Support**: Basic offline functionality where applicable

## Security Considerations
- **Access Control**: Role-based permissions (Admin, Ops, Finance, Partners)
- **Data Protection**: Secure document storage, access logging
- **Input Validation**: Sanitize all user inputs
- **HTTPS**: Enforce secure connections in production

## Testing Requirements
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: Mobile, tablet, desktop breakpoints
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast loading, optimized assets

## Global Instructions for Code Consistency

### 1. Component Reusability
- Create reusable components for common UI elements
- Maintain consistent spacing and typography
- Use Tailwind utility classes consistently

### 2. State Management
- Use JavaScript modules for state management
- Implement consistent data flow patterns
- Handle loading and error states uniformly

### 3. User Experience
- Provide clear navigation and breadcrumbs
- Implement consistent feedback mechanisms
- Ensure fast, responsive interactions

### 4. Data Presentation
- Use consistent table and card layouts
- Implement proper pagination and filtering
- Provide clear status indicators and badges

### 5. Form Handling
- Consistent validation and error messaging
- Proper focus management and accessibility
- Clear submission and success states

## Module-Specific Guidelines

### Consulting Module
- Focus on project management and client billing
- Implement time tracking with visual timers
- Provide comprehensive document management

### Logistics Module
- Real-time tracking with status updates
- Document management for shipping papers
- Compliance checking and alerts

### Compliance Module
- Alert system for expiring documents
- Contract and license management
- Integration with external compliance systems

### HR & Finance Module
- Form management with approval workflows
- Financial reporting and analytics
- Employee data management

## Future Extensibility
- **Sub-brands**: Global Insights, Global Marketplace, Global Edge
- **API Integration**: External services and third-party tools
- **Mobile App**: Native mobile application
- **Advanced Analytics**: Business intelligence and reporting
- **Automation**: Workflow automation and AI assistance

## Maintenance Notes
- Keep external dependencies updated
- Monitor performance and optimize as needed
- Regular accessibility audits
- User feedback integration and iteration
