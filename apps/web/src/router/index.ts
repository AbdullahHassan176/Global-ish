import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/demo',
    children: [
      {
        path: 'files',
        name: 'FilesDemo',
        component: () => import('../views/demo/FilesDemo.vue'),
      },
      {
        path: 'workflows',
        name: 'WorkflowsDemo',
        component: () => import('../views/demo/WorkflowsDemo.vue'),
      },
      {
        path: 'tasks',
        name: 'TasksDemo',
        component: () => import('../views/demo/TasksDemo.vue'),
      },
      {
        path: 'notifications',
        name: 'NotificationsDemo',
        component: () => import('../views/demo/NotificationsDemo.vue'),
      },
      {
        path: 'marketing',
        name: 'MarketingDashboard',
        component: () => import('../views/demo/MarketingDashboard.vue'),
      },
      {
        path: 'compliance',
        name: 'ComplianceDashboard',
        component: () => import('../views/demo/ComplianceDashboard.vue'),
      },
      {
        path: 'hr-finance',
        name: 'HRFinanceDashboard',
        component: () => import('../views/demo/HRFinanceDashboard.vue'),
      },
      {
        path: 'logistics',
        name: 'LogisticsDashboard',
        component: () => import('../views/demo/LogisticsDashboard.vue'),
      },
      {
        path: 'logistics/tracking',
        name: 'ShipmentTracking',
        component: () => import('../views/demo/ShipmentTracking.vue'),
      },
      {
        path: 'logistics/integrations',
        name: 'CarrierIntegrations',
        component: () => import('../views/demo/CarrierIntegrations.vue'),
      },
      {
        path: 'integrations',
        name: 'IntegrationsDashboard',
        component: () => import('../views/demo/IntegrationsDashboard.vue'),
      },
      {
        path: 'security',
        name: 'SecurityDashboard',
        component: () => import('../views/demo/SecurityDashboard.vue'),
      },
      {
        path: 'reporting',
        name: 'ReportingDashboard',
        component: () => import('../views/demo/ReportingDashboard.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
]
