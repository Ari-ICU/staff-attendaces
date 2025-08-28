'use client';

import { useState, useEffect, useMemo } from 'react';

interface Leave {
  staffId: string;
  staffName: string;
  reason: string;
  timestamp: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

// Static leave data (without dynamic timestamps)
const initialLeaves: Omit<Leave, 'timestamp'>[] = [
  { staffId: 'S001', staffName: 'John Doe', reason: 'Medical Leave', status: 'Pending' },
  { staffId: 'S002', staffName: 'Jane Smith', reason: 'Personal Leave', status: 'Pending' },
  { staffId: 'S003', staffName: 'Alice Johnson', reason: 'Vacation', status: 'Pending' },
];

// Helper: clsx
function clsx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Helper: Format relative time
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

// Helper: Badge color
const getLeaveBadgeColor = (reason: string) => {
  switch (reason.toLowerCase()) {
    case 'medical leave':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case 'vacation':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'personal leave':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'maternity leave':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300';
    case 'unpaid leave':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
  }
};

// Icon for leave
const LeaveIcon = () => (
  <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default function StaffLeavePage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  // Set timestamps only on client to prevent hydration mismatch
  useEffect(() => {
    const now = new Date();
    setLeaves(
      initialLeaves.map((l, i) => ({
        ...l,
        timestamp: new Date(now.getTime() - i * 30 * 60 * 1000).toISOString(), // 0, 30min, 60min
      }))
    );
  }, []);

  const recentLeaves = useMemo(() => {
    return [...leaves].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [leaves]);

  const handleLeaveAction = (index: number, newStatus: 'Accepted' | 'Rejected') => {
    const updated = [...leaves];
    updated[index].status = newStatus;
    setLeaves(updated);
  };

  return (
    <>
      <title>Staff Leave Requests | StaffFlow</title>
      <meta name="description" content="View and manage recent staff leave requests." />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
              <LeaveIcon />
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            📝 Recent Staff Leaves
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track and manage staff leave requests.
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
                  <th className="p-4 font-semibold">Reason</th>
                  <th className="p-4 font-semibold">Requested</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">🛌</span>
                        <p className="text-base">No leave requests recorded yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentLeaves.map((leave, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-[1.005] hover:shadow-inner"
                    >
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{leave.staffId}</td>
                      <td className="p-4 text-gray-800 dark:text-gray-200">{leave.staffName}</td>
                      <td className="p-4">
                        <span
                          className={clsx(
                            'inline-block px-3 py-1 rounded-full text-xs font-medium',
                            getLeaveBadgeColor(leave.reason)
                          )}
                        >
                          {leave.reason}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span>{new Date(leave.timestamp).toLocaleTimeString()}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(leave.timestamp)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 flex gap-2">
                        {leave.status === 'Pending' ? (
                          <>
                            <button
                              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                              onClick={() => handleLeaveAction(index, 'Accepted')}
                            >
                              Accept
                            </button>
                            <button
                              className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                              onClick={() => handleLeaveAction(index, 'Rejected')}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={clsx(
                              'px-3 py-1 rounded-full text-xs font-medium',
                              leave.status === 'Accepted'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                            )}
                          >
                            {leave.status}
                          </span>
                        )}
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
          {recentLeaves.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-md backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">🛌</span>
                <p className="text-sm">No leave requests recorded yet.</p>
              </div>
            </div>
          ) : (
            recentLeaves.map((leave, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                      {leave.staffName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {leave.staffId}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(leave.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="mb-3">
                  <span
                    className={clsx(
                      'inline-block px-3 py-1 rounded-full text-xs font-medium',
                      getLeaveBadgeColor(leave.reason)
                    )}
                  >
                    {leave.reason}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatRelativeTime(leave.timestamp)}</span>
                  {leave.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        onClick={() => handleLeaveAction(index, 'Accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                        onClick={() => handleLeaveAction(index, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={clsx(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        leave.status === 'Accepted'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                      )}
                    >
                      {leave.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
