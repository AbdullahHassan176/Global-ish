'use client';

import { useState } from 'react';
import { DataTable, Column } from '@global-next/ui';
import { Upload, Download, Eye, Trash2, Tag, Shield, FileText } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'clean' | 'scanning' | 'infected';
  accessLevel: 'public' | 'internal' | 'private' | 'confidential';
  tags: string[];
  version: number;
  ocrStatus: 'pending' | 'processing' | 'completed' | 'failed';
  chainAnchor?: string;
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'contract_agreement.pdf',
    size: '2.4 MB',
    type: 'PDF',
    uploadedBy: 'John Doe',
    uploadedAt: '2024-01-15',
    status: 'clean',
    accessLevel: 'confidential',
    tags: ['contract', 'legal', 'agreement'],
    version: 1,
    ocrStatus: 'completed',
    chainAnchor: '0x1234...5678'
  },
  {
    id: '2',
    name: 'invoice_2024_001.pdf',
    size: '1.2 MB',
    type: 'PDF',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2024-01-14',
    status: 'clean',
    accessLevel: 'internal',
    tags: ['invoice', 'finance', '2024'],
    version: 1,
    ocrStatus: 'completed'
  },
  {
    id: '3',
    name: 'suspicious_file.exe',
    size: '5.8 MB',
    type: 'Executable',
    uploadedBy: 'Unknown',
    uploadedAt: '2024-01-13',
    status: 'infected',
    accessLevel: 'private',
    tags: ['quarantined'],
    version: 1,
    ocrStatus: 'failed'
  },
  {
    id: '4',
    name: 'presentation_draft.pptx',
    size: '8.1 MB',
    type: 'PowerPoint',
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2024-01-12',
    status: 'scanning',
    accessLevel: 'internal',
    tags: ['presentation', 'draft'],
    version: 2,
    ocrStatus: 'processing'
  }
];

export default function FilesDemoPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);

  const columns: Column<FileItem>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{value}</span>
          {row.version > 1 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              v{row.version}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'size',
      title: 'Size',
      sortable: true,
      width: '100px'
    },
    {
      key: 'type',
      title: 'Type',
      sortable: true,
      width: '100px'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      width: '120px',
      render: (value) => {
        const statusColors = {
          clean: 'bg-green-100 text-green-800',
          scanning: 'bg-yellow-100 text-yellow-800',
          infected: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value]}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'accessLevel',
      title: 'Access',
      sortable: true,
      width: '120px',
      render: (value) => {
        const accessColors = {
          public: 'bg-green-100 text-green-800',
          internal: 'bg-blue-100 text-blue-800',
          private: 'bg-gray-100 text-gray-800',
          confidential: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${accessColors[value]}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'ocrStatus',
      title: 'OCR',
      sortable: true,
      width: '100px',
      render: (value) => {
        const ocrColors = {
          pending: 'bg-gray-100 text-gray-800',
          processing: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${ocrColors[value]}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'chainAnchor',
      title: 'Blockchain',
      width: '120px',
      render: (value) => (
        value ? (
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">Anchored</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Pending</span>
        )
      )
    },
    {
      key: 'uploadedBy',
      title: 'Uploaded By',
      sortable: true,
      width: '120px'
    },
    {
      key: 'uploadedAt',
      title: 'Date',
      sortable: true,
      width: '100px'
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Download className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const handleExport = () => {
    console.log('Exporting files...');
  };

  const handleRowClick = (row: FileItem) => {
    console.log('File clicked:', row);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Files Management Demo</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive file management with virus scanning, OCR, blockchain anchoring, and access control
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clean Files</p>
                <p className="text-2xl font-bold text-gray-900">1,198</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Tag className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">OCR Processed</p>
                <p className="text-2xl font-bold text-gray-900">892</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Blockchain Anchored</p>
                <p className="text-2xl font-bold text-gray-900">756</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="btn btn-primary">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </button>
            <button className="btn btn-outline">
              <Tag className="h-4 w-4 mr-2" />
              Manage Tags
            </button>
            <button className="btn btn-outline">
              <Shield className="h-4 w-4 mr-2" />
              Access Control
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {selectedFiles.length} file(s) selected
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={mockFiles}
          columns={columns}
          selectable
          selectedRows={selectedFiles}
          onSelectionChange={setSelectedFiles}
          onRowClick={handleRowClick}
          onExport={handleExport}
          exportable
          searchable
          filterable
          pagination={{
            page: 1,
            limit: 20,
            total: mockFiles.length,
            onPageChange: (page) => console.log('Page changed:', page),
            onLimitChange: (limit) => console.log('Limit changed:', limit)
          }}
        />

        {/* Features Demo */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Virus scanning with multiple providers (ClamAV, VirusTotal, AWS GuardDuty)</span>
              </li>
              <li className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>OCR processing with Tesseract, AWS Textract, Azure Cognitive Services</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Blockchain anchoring for document integrity verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-orange-600" />
                <span>Advanced tagging and categorization system</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span>Granular access control with role-based permissions</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Providers</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Amazon S3</span>
                <span className="text-sm text-gray-600">Primary storage</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Azure Blob Storage</span>
                <span className="text-sm text-gray-600">Secondary storage</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Local Storage</span>
                <span className="text-sm text-gray-600">Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
