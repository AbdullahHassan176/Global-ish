'use client';

import { signOut } from 'next-auth/react';

interface DashboardContentProps {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global Next Portal</h1>
              <p className="text-gray-600">Welcome back, {user.name || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Role: {user.role || 'User'}</span>
              <button
                onClick={() => signOut()}
                className="btn btn-outline btn-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* KPI Cards */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900">Active Projects</h3>
              <p className="text-3xl font-bold text-primary-600">12</p>
              <p className="text-sm text-gray-500">+2 from last month</p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
              <p className="text-3xl font-bold text-yellow-600">5</p>
              <p className="text-sm text-gray-500">Requires attention</p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">$2.4M</p>
              <p className="text-sm text-gray-500">+12% from last quarter</p>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="btn btn-primary btn-md">
                  New Project
                </button>
                <button className="btn btn-secondary btn-md">
                  View Reports
                </button>
                <button className="btn btn-outline btn-md">
                  Manage Users
                </button>
                <button className="btn btn-outline btn-md">
                  Settings
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6 md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Project "Global Expansion" was completed</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Budget approval required for Q1 planning</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New team member John Doe was added</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
