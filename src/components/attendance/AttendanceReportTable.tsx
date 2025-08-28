"use client";

import { useState, useMemo } from "react";

interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  status: "Present" | "Absent" | "Leave" | "Late";
}

interface AttendanceReportTableProps {
  records: AttendanceRecord[];
}

export default function AttendanceReportTable({ records }: AttendanceReportTableProps) {
  const [isLoading] = useState(false); // Simulate loading if needed later

  const sortedRecords = useMemo(
    () =>
      [...(records || [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [records]
  );

  // Status badge color mapping
  const getStatusStyles = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      case "Absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      case "Leave":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "Late":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Desktop Table */}
      <div className="hidden sm:block max-w-6xl mx-auto">
        {isLoading ? (
          <TableSkeleton />
        ) : sortedRecords.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-600 dark:from-gray-900 dark:to-gray-850 text-gray-900 dark:text-gray-300 uppercase tracking-wide text-xs sm:text-sm">
                  <tr>
                    <th className="px-5 py-4 rounded-tl-2xl">Name</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 rounded-tr-2xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {sortedRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all duration-200 hover:shadow-inner"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">
                        {record.name}
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyles(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden max-w-md mx-auto space-y-4">
        {isLoading ? (
          <MobileSkeleton />
        ) : sortedRecords.length === 0 ? (
          <EmptyState />
        ) : (
          sortedRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {record.name}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${getStatusStyles(
                    record.status
                  )}`}
                >
                  {record.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span className="text-gray-500 dark:text-gray-400">Date</span>
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// === Loading Skeletons ===
function TableSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
      <div className="p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-14 bg-gray-100 dark:bg-gray-800 rounded mb-3 last:mb-0"
          ></div>
        ))}
      </div>
    </div>
  );
}

function MobileSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-md p-5 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center p-10 bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-md backdrop-blur-sm max-w-md mx-auto">
      <div className="text-6xl mb-3">📅</div>
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
        No Attendance Records
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        All attendance records will appear here.
      </p>
    </div>
  );
}