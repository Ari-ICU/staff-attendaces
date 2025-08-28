'use client';

import { useRouter } from 'next/navigation';
import TeamMemberCard from '@/components/department/team/TeamMemberCard';
import { FaArrowLeft } from 'react-icons/fa';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar?: string;
}

// Sample data: replace with API call
const sampleTeam: TeamMember[] = [
  { id: 1, name: 'Alice Johnson', role: 'HR Manager' },
  { id: 2, name: 'Bob Smith', role: 'HR Assistant' },
  { id: 3, name: 'Carol Davis', role: 'Recruiter' },
  { id: 4, name: 'David Lee', role: 'Payroll Specialist' },
];

export default function TeamPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-300">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-800 dark:from-slate-100 dark:via-blue-300 dark:to-indigo-200 tracking-tight">
              HR Team
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md">
              Meet the dedicated professionals shaping our workplace culture.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-slate-700 dark:text-slate-200 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <FaArrowLeft  />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {sampleTeam.map((member) => (
            <div
              key={member.id}
              className="transform-gpu transition-all duration-300 hover:scale-105"
            >
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}