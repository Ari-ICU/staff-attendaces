// attendance report page'use client';
'use client';


import AttendanceReportTable from '@/components/attendance/AttendanceReportTable';

interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Late';
}

// Sample data (replace with API call later)
const sampleRecords: AttendanceRecord[] = [
  { id: 1, name: 'Alice Johnson', date: '2025-08-25', status: 'Present' },
  { id: 2, name: 'Bob Smith', date: '2025-08-25', status: 'Late' },
  { id: 3, name: 'Carol Davis', date: '2025-08-25', status: 'Leave' },
  { id: 4, name: 'David Lee', date: '2025-08-25', status: 'Absent' },
];

export default function AttendanceReportPage() {

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Attendance Report
        </h1>
      </div>

      {/* Report Table */}
      <AttendanceReportTable records={sampleRecords} />
    </div>
  );
}
