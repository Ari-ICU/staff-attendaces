"use client";

import { useState, useMemo, lazy, Suspense } from "react";

// Lazy load PayrollDetails modal
const PayrollDetails = lazy(() => import("@/components/payroll/PayrollDetails"));

interface PayrollReport {
  id: number;
  name: string;
  role: string;
  salary: number;
  paymentDate: string;
}

const reports: PayrollReport[] = [
  { id: 1, name: "Alice Johnson", role: "HR Manager", salary: 1200, paymentDate: "2025-08-25" },
  { id: 2, name: "John Smith", role: "Developer", salary: 1500, paymentDate: "2025-08-25" },
];

export default function PayrollReportsTable() {
  const [month, setMonth] = useState("2025-08");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PayrollReport;
    direction: "asc" | "desc";
  }>({
    key: "name",
    direction: "asc",
  });
  const [selectedReport, setSelectedReport] = useState<PayrollReport | null>(null);

  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (month) {
      filtered = filtered.filter((report) => report.paymentDate.startsWith(month));
    }

    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [reports, searchTerm, month, sortConfig]);

  const handleSort = (key: keyof PayrollReport) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <>
      {/* SEO Meta */}
      <title>Payroll Reports | StaffFlow</title>
      <meta
        name="description"
        content="Browse and manage payroll reports with search, filter, and detailed views."
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            💸 Payroll Reports
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search, filter, and view detailed payroll reports for your team.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or role..."
              className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search payroll reports"
            />
          </div>

          {/* Month Filter */}
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 text-sm sm:text-base min-w-36 sm:min-w-48"
            aria-label="Filter by month"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block max-w-6xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-600 dark:from-gray-900 dark:to-gray-850 text-gray-900 dark:text-gray-300 uppercase tracking-wide text-xs sm:text-sm">
                {(["name", "role", "salary", "paymentDate"] as (keyof PayrollReport)[]).map(
                  (key) => (
                    <th
                      key={key}
                      className="p-4 font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-1">
                        {key === "paymentDate"
                          ? "Payment Date"
                          : key.charAt(0).toUpperCase() + key.slice(1)}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {sortConfig.key === key && (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </span>
                      </div>
                    </th>
                  )
                )}
                <th className="p-4 font-semibold">Details</th>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📊</span>
                        <p className="text-base">No payroll reports found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-[1.002]"
                    >
                      <td className="p-4 text-gray-900 dark:text-gray-100">{report.name}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">{report.role}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        ${report.salary.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {report.paymentDate}
                      </td>
                      <td className="p-4">
                        <button
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-dotted decoration-1 underline-offset-4 hover:decoration-solid transition-all duration-200"
                          onClick={() => setSelectedReport(report)}
                        >
                          View Details
                        </button>
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
          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-md backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">📊</span>
                <p className="text-sm">No payroll reports found matching your criteria.</p>
              </div>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{report.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.role} • ${report.salary.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Paid on: {report.paymentDate}
                  </p>
                </div>
                <button
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-dotted underline-offset-4 hover:decoration-solid transition-all duration-200"
                  onClick={() => setSelectedReport(report)}
                >
                  View Full Details
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {selectedReport && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <PayrollDetails report={selectedReport} onClose={() => setSelectedReport(null)} />
          </Suspense>
        )}
      </div>
    </>
  );
}