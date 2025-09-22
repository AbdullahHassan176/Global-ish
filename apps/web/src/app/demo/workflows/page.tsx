'use client';

import { useState } from 'react';
import { Stepper } from '@global-next/ui';
import { Play, Pause, CheckCircle, XCircle, Clock, Users, FileText, Shield } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  assignedTo: string;
  dueDate: string;
  sla: string;
  data: any;
}

interface WorkflowInstance {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  currentStep: number;
  startedBy: string;
  startedAt: string;
  progress: number;
  steps: WorkflowStep[];
}

const mockWorkflows: WorkflowInstance[] = [
  {
    id: '1',
    name: 'Contract Approval Process',
    status: 'running',
    currentStep: 2,
    startedBy: 'John Doe',
    startedAt: '2024-01-15',
    progress: 40,
    steps: [
      {
        id: '1-1',
        name: 'Legal Review',
        description: 'Review contract terms and conditions',
        status: 'completed',
        assignedTo: 'Legal Team',
        dueDate: '2024-01-16',
        sla: '2 days',
        data: { comments: 'Approved with minor revisions' }
      },
      {
        id: '1-2',
        name: 'Finance Approval',
        description: 'Review financial terms and budget impact',
        status: 'in_progress',
        assignedTo: 'Finance Team',
        dueDate: '2024-01-18',
        sla: '3 days',
        data: { comments: 'Under review' }
      },
      {
        id: '1-3',
        name: 'Executive Sign-off',
        description: 'Final executive approval',
        status: 'pending',
        assignedTo: 'CEO',
        dueDate: '2024-01-20',
        sla: '1 day',
        data: {}
      },
      {
        id: '1-4',
        name: 'Digital Signature',
        description: 'Collect digital signatures from all parties',
        status: 'pending',
        assignedTo: 'Admin Team',
        dueDate: '2024-01-22',
        sla: '2 days',
        data: {}
      }
    ]
  },
  {
    id: '2',
    name: 'Employee Onboarding',
    status: 'paused',
    currentStep: 1,
    startedBy: 'HR Team',
    startedAt: '2024-01-14',
    progress: 20,
    steps: [
      {
        id: '2-1',
        name: 'Background Check',
        description: 'Complete background verification',
        status: 'in_progress',
        assignedTo: 'HR Team',
        dueDate: '2024-01-17',
        sla: '3 days',
        data: { comments: 'Waiting for third-party response' }
      },
      {
        id: '2-2',
        name: 'IT Setup',
        description: 'Configure user accounts and equipment',
        status: 'pending',
        assignedTo: 'IT Team',
        dueDate: '2024-01-19',
        sla: '2 days',
        data: {}
      },
      {
        id: '2-3',
        name: 'Training Assignment',
        description: 'Assign required training modules',
        status: 'pending',
        assignedTo: 'Training Team',
        dueDate: '2024-01-21',
        sla: '2 days',
        data: {}
      }
    ]
  },
  {
    id: '3',
    name: 'Invoice Processing',
    status: 'completed',
    currentStep: 4,
    startedBy: 'Finance Team',
    startedAt: '2024-01-10',
    progress: 100,
    steps: [
      {
        id: '3-1',
        name: 'Invoice Validation',
        description: 'Validate invoice details and amounts',
        status: 'completed',
        assignedTo: 'Finance Team',
        dueDate: '2024-01-11',
        sla: '1 day',
        data: { comments: 'All details verified' }
      },
      {
        id: '3-2',
        name: 'Approval',
        description: 'Get manager approval for payment',
        status: 'completed',
        assignedTo: 'Finance Manager',
        dueDate: '2024-01-12',
        sla: '1 day',
        data: { comments: 'Approved for payment' }
      },
      {
        id: '3-3',
        name: 'Payment Processing',
        description: 'Process payment through banking system',
        status: 'completed',
        assignedTo: 'Finance Team',
        dueDate: '2024-01-13',
        sla: '1 day',
        data: { comments: 'Payment processed successfully' }
      },
      {
        id: '3-4',
        name: 'Documentation',
        description: 'Archive payment records',
        status: 'completed',
        assignedTo: 'Finance Team',
        dueDate: '2024-01-14',
        sla: '1 day',
        data: { comments: 'Records archived' }
      }
    ]
  }
];

export default function WorkflowsDemoPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowInstance | null>(null);
  const [activeTab, setActiveTab] = useState<'instances' | 'templates'>('instances');

  const getStatusColor = (status: string) => {
    const colors = {
      running: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStepStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      skipped: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workflows Management Demo</h1>
          <p className="text-gray-600 mt-2">
            JSON-defined workflows with roles, conditions, SLAs, approvals, and signature integration
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Pause className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paused</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('instances')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'instances'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Workflow Instances
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Workflow Templates
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'instances' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflow List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Active Workflows</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      onClick={() => setSelectedWorkflow(workflow)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedWorkflow?.id === workflow.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Started by {workflow.startedBy} on {workflow.startedAt}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Step {workflow.currentStep} of {workflow.steps.length}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {workflow.progress}%
                        </div>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${workflow.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Workflow Details */}
            <div className="lg:col-span-2">
              {selectedWorkflow ? (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{selectedWorkflow.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedWorkflow.status)}`}>
                          {selectedWorkflow.status}
                        </span>
                        <button className="btn btn-outline btn-sm">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </button>
                        <button className="btn btn-primary btn-sm">
                          <Play className="h-4 w-4 mr-1" />
                          Resume
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Started by:</span>
                        <span className="ml-2 font-medium">{selectedWorkflow.startedBy}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Started at:</span>
                        <span className="ml-2 font-medium">{selectedWorkflow.startedAt}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <span className="ml-2 font-medium">{selectedWorkflow.progress}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Step:</span>
                        <span className="ml-2 font-medium">{selectedWorkflow.currentStep} of {selectedWorkflow.steps.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Workflow Steps</h4>
                    <Stepper
                      steps={selectedWorkflow.steps.map((step, index) => ({
                        id: step.id,
                        title: step.name,
                        description: step.description,
                        status: step.status,
                        icon: getStepIcon(step.status)
                      }))}
                      currentStep={selectedWorkflow.currentStep - 1}
                    />
                    
                    <div className="mt-6 space-y-4">
                      {selectedWorkflow.steps.map((step, index) => (
                        <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStepIcon(step.status)}
                              <h5 className="font-medium text-gray-900">{step.name}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStepStatusColor(step.status)}`}>
                                {step.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              SLA: {step.sla}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">Assigned to: {step.assignedTo}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">Due: {step.dueDate}</span>
                              </div>
                            </div>
                            {step.status === 'in_progress' && (
                              <button className="btn btn-primary btn-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </button>
                            )}
                          </div>
                          {step.data.comments && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                              <strong>Comments:</strong> {step.data.comments}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Workflow</h3>
                  <p className="text-gray-600">Choose a workflow from the list to view its details and progress</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Workflow Templates</h3>
              <button className="btn btn-primary">
                <FileText className="h-4 w-4 mr-2" />
                Create Template
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Contract Approval', description: 'Multi-step contract review and approval process', steps: 4, category: 'Legal' },
                { name: 'Employee Onboarding', description: 'Complete onboarding workflow for new employees', steps: 6, category: 'HR' },
                { name: 'Invoice Processing', description: 'Automated invoice validation and payment workflow', steps: 4, category: 'Finance' },
                { name: 'Purchase Request', description: 'Purchase request approval and procurement workflow', steps: 5, category: 'Procurement' },
                { name: 'Document Review', description: 'Document review and approval process', steps: 3, category: 'General' },
                { name: 'Incident Response', description: 'Security incident response and escalation workflow', steps: 7, category: 'Security' }
              ].map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{template.steps} steps</span>
                    <button className="btn btn-outline btn-sm">
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Demo */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>JSON-defined workflow steps with conditions and SLAs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-600" />
                <span>Role-based step assignments and approvals</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Digital signature integration (DocuSign, Adobe Sign)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>SLA monitoring and escalation alerts</span>
              </li>
              <li className="flex items-center space-x-2">
                <Play className="h-4 w-4 text-red-600" />
                <span>Workflow pause, resume, and cancellation</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Points</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">DocuSign</span>
                <span className="text-sm text-gray-600">E-signature</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Adobe Sign</span>
                <span className="text-sm text-gray-600">E-signature</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Email Service</span>
                <span className="text-sm text-gray-600">Notifications</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">SMS Service</span>
                <span className="text-sm text-gray-600">Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
