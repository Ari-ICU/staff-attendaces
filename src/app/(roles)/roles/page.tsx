'use client';

import RoleList from '@/components/role/RoleList';
import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';

export default function RolesPage() {
  const router = useRouter();

  // Sample data; replace with API later
  const roles = [
    { id: 1, title: 'HR Manager', description: 'Oversees all HR operations.', department: 'Human Resources', color: 'blue' },
    { id: 2, title: 'Finance Analyst', description: 'Analyzes financial data and prepares reports.', department: 'Finance', color: 'indigo' },
    { id: 3, title: 'Software Engineer', description: 'Develops and maintains software applications.', department: 'IT & Development', color: 'teal' },
    { id: 4, title: 'Marketing Specialist', description: 'Plans and executes marketing campaigns.', department: 'Marketing', color: 'orange' },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            Roles
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-300 max-w-md">
            Manage and organize team roles across departments.
          </p>
        </div>

        <button
          onClick={() => router.push('/roles/add')}
          className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          aria-label="Add new role"
        >
          <FiPlus />
          <span>Add Role</span>
        </button>
      </div>

      {/* Role List */}
      <div>
        <RoleList roles={roles} />
      </div>

    </div>
  );
}
