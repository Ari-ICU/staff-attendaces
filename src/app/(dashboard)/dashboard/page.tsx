"use client";

import { useState, lazy, Suspense } from "react";

// Lazy load chart components
const AttendanceChart = lazy(() => import("@/components/dashboard/AttendanceChart"));
const DepartmentChart = lazy(() => import("@/components/dashboard/DepartmentChart"));

// Skeleton loader component
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

export default function Dashboard() {
  const [attendanceData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Attendance",
        data: [20, 18, 22, 19, 21],
        backgroundColor: "#4f46e5",
      },
    ],
  });

  const [departmentData] = useState({
    labels: ["HR", "IT", "Finance", "Marketing", "Sales"],
    datasets: [
      {
        label: "Staff per Department",
        data: [5, 12, 8, 6, 10],
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#f59e0b",
          "#10b981",
          "#8b5cf6",
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-gray-800 dark:text-white text-center">
        Staff Management Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[
          { title: "Total Staff", value: 51, color: "text-blue-600 dark:text-blue-400" },
          { title: "Present Today", value: 45, color: "text-green-600 dark:text-green-400" },
          { title: "Absent Today", value: 6, color: "text-red-600 dark:text-red-400" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{stat.title}</h2>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 sm:gap-6">
        {/* Weekly Attendance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Weekly Attendance
          </h2>
          <Suspense fallback={<ChartSkeleton />}>
            <AttendanceChart data={attendanceData} />
          </Suspense>
        </div>

        {/* Staff by Department */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Staff by Department
          </h2>
          <Suspense fallback={<ChartSkeleton />}>
            <DepartmentChart data={departmentData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}