'use client';

import { useState, useEffect, useMemo } from 'react';

interface CheckOut {
  staffId: string;
  staffName: string;
  checkInTimestamp: string;
  checkOutTimestamp: string;
}

// Format relative time (e.g., "30 minutes ago")
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

// Calculate work duration
const formatDuration = (checkIn: string, checkOut: string): string => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

export default function StaffCheckOutPage() {
  const [checkOuts, setCheckOuts] = useState<CheckOut[]>([]);

  // Populate data only on client to avoid hydration mismatch
  useEffect(() => {
    const now = new Date();
    const initialCheckOuts: CheckOut[] = [
      {
        staffId: 'S001',
        staffName: 'John Doe',
        checkInTimestamp: new Date(now.getTime() - 9 * 60 * 60 * 1000).toISOString(),
        checkOutTimestamp: now.toISOString(),
      },
      {
        staffId: 'S002',
        staffName: 'Jane Smith',
        checkInTimestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
        checkOutTimestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      },
      {
        staffId: 'S003',
        staffName: 'Alice Johnson',
        checkInTimestamp: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
        checkOutTimestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      },
    ];
    setCheckOuts(initialCheckOuts);
  }, []);

  const recentCheckOuts = useMemo(
    () =>
      [...checkOuts].sort(
        (a, b) => new Date(b.checkOutTimestamp).getTime() - new Date(a.checkOutTimestamp).getTime()
      ),
    [checkOuts]
  );

  return (
    <>
      <title>Staff Check-Out List | StaffFlow</title>
      <meta name="description" content="View recent staff check-out records and work duration." />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            ⏰ Recent Staff Check-Outs
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track completed work sessions and check-out times.
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
                  <th className="p-4 font-semibold">Check-In</th>
                  <th className="p-4 font-semibold">Check-Out</th>
                  <th className="p-4 font-semibold">Duration</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentCheckOuts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">👤</span>
                        <p className="text-base">No check-outs recorded yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentCheckOuts.map((checkOut, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-[1.005] hover:shadow-inner"
                    >
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{checkOut.staffId}</td>
                      <td className="p-4 text-gray-800 dark:text-gray-200">{checkOut.staffName}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        {new Date(checkOut.checkInTimestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span>{new Date(checkOut.checkOutTimestamp).toLocaleTimeString()}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(checkOut.checkOutTimestamp)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-gray-700 dark:text-gray-300">
                        {formatDuration(checkOut.checkInTimestamp, checkOut.checkOutTimestamp)}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          Checked Out
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
          {recentCheckOuts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-md backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">👤</span>
                <p className="text-sm">No check-outs recorded yet.</p>
              </div>
            </div>
          ) : (
            recentCheckOuts.map((checkOut, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {checkOut.staffName}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(checkOut.checkOutTimestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    <span className="font-medium">ID:</span> {checkOut.staffId}
                  </p>
                  <p>
                    <span className="font-medium">In:</span>{' '}
                    {new Date(checkOut.checkInTimestamp).toLocaleTimeString()}
                  </p>
                  <p>
                    <span className="font-medium">Out:</span>{' '}
                    {new Date(checkOut.checkOutTimestamp).toLocaleTimeString()}
                  </p>
                  <p className="font-mono text-xs">
                    Duration: {formatDuration(checkOut.checkInTimestamp, checkOut.checkOutTimestamp)}
                  </p>
                </div>
                <div className="mt-3 flex justify-end">
                  <span className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Checked Out
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
