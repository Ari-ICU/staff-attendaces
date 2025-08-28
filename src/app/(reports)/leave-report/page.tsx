'use client';

import { useRouter } from 'next/navigation';
import LeaveReportTable from '@/components/leave/LeaveReportTable';

interface LeaveRecord {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  type: 'Sick Leave' | 'Casual Leave' | 'Maternity Leave' | 'Other';
  status: 'Approved' | 'Pending' | 'Rejected';
}

// Sample data (replace with API call later)
const sampleLeaveRecords: LeaveRecord[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    startDate: '2025-08-20',
    endDate: '2025-08-22',
    type: 'Sick Leave',
    status: 'Approved',
  },
  {
    id: 2,
    name: 'Bob Smith',
    startDate: '2025-08-23',
    endDate: '2025-08-25',
    type: 'Casual Leave',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Carol Davis',
    startDate: '2025-08-26',
    endDate: '2025-08-30',
    type: 'Maternity Leave',
    status: 'Approved',
  },
  {
    id: 4,
    name: 'David Lee',
    startDate: '2025-08-25',
    endDate: '2025-08-27',
    type: 'Other',
    status: 'Rejected',
  },
];

export default function LeaveReportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-800 dark:from-slate-100 dark:via-blue-300 dark:to-indigo-200">
              📅 Leave Report
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md">
              View and manage all employee leave requests in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="max-w-7xl mx-auto">
        <LeaveReportTable records={sampleLeaveRecords} />
      </div>
    </div>
  );
}