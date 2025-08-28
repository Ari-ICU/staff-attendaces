'use client';

import { useState, useMemo, useEffect } from 'react';

interface CheckIn {
  staffId: string;
  staffName: string;
  timestamp: string;
}

// Format timestamp to relative time (e.g., "5 minutes ago")
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMs = now.getTime() - time.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export default function StaffCheckInPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  // Populate initial data only on client to prevent hydration mismatch
  useEffect(() => {
    const now = new Date();
    const initialCheckIns: CheckIn[] = [
      { staffId: 'S001', staffName: 'John Doe', timestamp: now.toISOString() },
      { staffId: 'S002', staffName: 'Jane Smith', timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString() },
      { staffId: 'S003', staffName: 'Alice Johnson', timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString() },
      { staffId: 'S004', staffName: 'Bob Williams', timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString() },
      { staffId: 'S005', staffName: 'Emma Brown', timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString() },
    ];
    setCheckIns(initialCheckIns);
  }, []);

  const recentCheckIns = useMemo(
    () => [...checkIns].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [checkIns]
  );

  return (
    <>
      <title>Staff Check-In List | StaffFlow</title>
      <meta name="description" content="View recent staff check-in records in real time." />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            ✅ Recent Staff Check-Ins
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real-time tracking of today&#39;s staff arrivals.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block max-w-6xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-600 dark:from-gray-900 dark:to-gray-850 text-gray-900 dark:text-gray-300 uppercase tracking-wide text-xs sm:text-sm">
                <tr>
                  <th className="p-4 font-semibold">Staff ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Check-In Time</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentCheckIns.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">👤</span>
                        <p className="text-base">No check-ins recorded yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentCheckIns.map((checkIn, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-[1.005] hover:shadow-inner"
                    >
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{checkIn.staffId}</td>
                      <td className="p-4 text-gray-800 dark:text-gray-200">{checkIn.staffName}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span>{new Date(checkIn.timestamp).toLocaleTimeString()}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(checkIn.timestamp)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Present
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden max-w-md mx-auto space-y-4">
          {recentCheckIns.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-md backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">👤</span>
                <p className="text-sm">No check-ins recorded yet.</p>
              </div>
            </div>
          ) : (
            recentCheckIns.map((checkIn, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {checkIn.staffName}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(checkIn.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    ID: <span className="font-mono">{checkIn.staffId}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {formatRelativeTime(checkIn.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
