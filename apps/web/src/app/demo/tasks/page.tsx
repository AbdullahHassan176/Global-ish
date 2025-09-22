'use client';

import { useState } from 'react';
import { Kanban } from '@global-next/ui';
import { Plus, Calendar, User, MessageSquare, Paperclip, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  dueDate: string;
  createdBy: string;
  assignedTo: string[];
  comments: number;
  attachments: number;
  createdAt: string;
  updatedAt: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Set up NextAuth with OIDC providers and MFA support',
    status: 'in_progress',
    priority: 'high',
    progress: 75,
    dueDate: '2024-01-20',
    createdBy: 'John Doe',
    assignedTo: ['Jane Smith', 'Mike Johnson'],
    comments: 3,
    attachments: 2,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16'
  },
  {
    id: '2',
    title: 'Design database schema',
    description: 'Create Prisma schema for all modules with proper relationships',
    status: 'completed',
    priority: 'high',
    progress: 100,
    dueDate: '2024-01-18',
    createdBy: 'Jane Smith',
    assignedTo: ['John Doe'],
    comments: 5,
    attachments: 1,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-17'
  },
  {
    id: '3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'in_review',
    priority: 'medium',
    progress: 90,
    dueDate: '2024-01-22',
    createdBy: 'Mike Johnson',
    assignedTo: ['Sarah Wilson'],
    comments: 2,
    attachments: 0,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-17'
  },
  {
    id: '4',
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation with examples',
    status: 'todo',
    priority: 'medium',
    progress: 0,
    dueDate: '2024-01-25',
    createdBy: 'Sarah Wilson',
    assignedTo: ['John Doe'],
    comments: 0,
    attachments: 0,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  },
  {
    id: '5',
    title: 'Fix security vulnerabilities',
    description: 'Address OWASP Top 10 security issues in the application',
    status: 'urgent',
    priority: 'urgent',
    progress: 30,
    dueDate: '2024-01-19',
    createdBy: 'Security Team',
    assignedTo: ['John Doe', 'Jane Smith'],
    comments: 8,
    attachments: 3,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-17'
  },
  {
    id: '6',
    title: 'Optimize database queries',
    description: 'Improve query performance and add proper indexing',
    status: 'todo',
    priority: 'low',
    progress: 0,
    dueDate: '2024-01-30',
    createdBy: 'Mike Johnson',
    assignedTo: ['Jane Smith'],
    comments: 1,
    attachments: 0,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  }
];

export default function TasksDemoPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      in_review: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'in_review':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const kanbanColumns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: mockTasks.filter(task => task.status === 'todo')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      tasks: mockTasks.filter(task => task.status === 'in_progress')
    },
    {
      id: 'in_review',
      title: 'In Review',
      tasks: mockTasks.filter(task => task.status === 'in_review')
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: mockTasks.filter(task => task.status === 'completed')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tasks Management Demo</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive task management with assignments, due dates, progress tracking, comments, and attachments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
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
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </button>
            <button className="btn btn-outline">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </button>
            <button className="btn btn-outline">
              <User className="h-4 w-4 mr-2" />
              My Tasks
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                viewMode === 'kanban'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Task View */}
        {viewMode === 'kanban' ? (
          <Kanban
            columns={kanbanColumns}
            onTaskMove={(taskId, fromColumn, toColumn) => {
              console.log(`Moving task ${taskId} from ${fromColumn} to ${toColumn}`);
            }}
            onTaskClick={(task) => setSelectedTask(task)}
            renderTask={(task) => (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{task.assignedTo.length} assigned</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {task.comments > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{task.comments}</span>
                      </div>
                    )}
                    {task.attachments > 0 && (
                      <div className="flex items-center space-x-1">
                        <Paperclip className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{task.attachments}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {task.assignedTo.slice(0, 2).map((user, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700"
                      >
                        {user.charAt(0)}
                      </div>
                    ))}
                    {task.assignedTo.length > 2 && (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        +{task.assignedTo.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Task List</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {mockTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {task.progress}% complete
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Assigned to {task.assignedTo.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due {task.dueDate}</span>
                      </div>
                      {task.comments > 0 && (
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{task.comments} comments</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center space-x-1">
                          <Paperclip className="h-4 w-4" />
                          <span>{task.attachments} attachments</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created by {task.createdBy} on {task.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h3>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedTask.progress}% complete
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{selectedTask.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created by:</span>
                    <span className="ml-2 font-medium">{selectedTask.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Due date:</span>
                    <span className="ml-2 font-medium">{selectedTask.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="ml-2 font-medium">{selectedTask.assignedTo.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 font-medium">{selectedTask.createdAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Progress</h4>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedTask.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Comments ({selectedTask.comments})</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">John Doe</span>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Great progress on this task! Keep it up.</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">Jane Smith</span>
                        <span className="text-xs text-gray-500">1 day ago</span>
                      </div>
                      <p className="text-sm text-gray-700">I've reviewed the code and it looks good. Ready for testing.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Attachments ({selectedTask.attachments})</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">design-mockup.fig</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">requirements.pdf</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="btn btn-primary">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </button>
                  <button className="btn btn-outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </button>
                  <button className="btn btn-outline">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Add Attachment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Demo */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Full CRUD operations for task management</span>
              </li>
              <li className="flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-600" />
                <span>Multi-user task assignments and notifications</span>
              </li>
              <li className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span>Due date tracking with overdue alerts</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Percentage complete tracking and progress bars</span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-red-600" />
                <span>Comments and attachments for collaboration</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Views</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Kanban Board</span>
                <span className="text-sm text-gray-600">Drag & drop</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">List View</span>
                <span className="text-sm text-gray-600">Detailed table</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Calendar View</span>
                <span className="text-sm text-gray-600">Timeline</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">My Tasks</span>
                <span className="text-sm text-gray-600">Personal view</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
