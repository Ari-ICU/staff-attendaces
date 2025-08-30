"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { format, parse, isWithinInterval, isValid, parseISO } from "date-fns";
import * as XLSX from "xlsx";

interface ReportData {
  id: string;
  period: string;
  date: string;
  totalEmployees: number;
  totalHours: number;
  totalGross: number;
  totalTax: number;
  totalNet: number;
  status: string;
  employees?: Employee[];
}

interface Employee {
  id: string;
  name: string;
  department: string;
  hourlyRate: number;
  hoursWorked: number;
  gross: number;
  tax: number;
  net: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  overtimeHours: number;
  regularHours: number;
}

interface StoredPayrollData {
  id?: string;
  period: string;
  runDate: string;
  employees: StoredEmployee[];
}

interface StoredEmployee {
  id: string;
  name: string;
  department: string;
  hourlyRate: number;
  hoursWorked: number;
  gross: number;
  tax: number;
  net: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  overtimeHours: number;
  regularHours: number;
}

interface DateRange {
  start: string;
  end: string;
}

interface Totals {
  totalEmployees: number;
  totalHours: number;
  totalGross: number;
  totalTax: number;
  totalNet: number;
  totalReports: number;
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: string;
  color?: "blue" | "green" | "yellow" | "purple" | "gray";
}

function SummaryCard({ title, value, icon, color = "gray" }: SummaryCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    gray: "bg-gray-50 border-gray-200 text-gray-800",
  };

  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl shadow border-2 ${colorClasses[color]} transition-transform hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl sm:text-2xl">{icon}</span>
        <div className="text-right">
          <p className="text-lg sm:text-2xl font-bold">{value}</p>
          <p className="text-xs sm:text-sm opacity-75">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function PayrollReport() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [newPayrollAdded, setNewPayrollAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  // Custom date parsing function with better error handling
  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date("Invalid Date");

    try {
      const formats = [
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
        "yyyy-MM-dd",
        "MM/dd/yyyy",
        "dd/MM/yyyy",
        "MMMM dd, yyyy",
      ];

      for (const fmt of formats) {
        const parsed = parse(dateStr, fmt, new Date());
        if (isValid(parsed)) return parsed;
      }
    } catch (err) {
      console.warn("Date parsing error:", err);
    }

    return new Date("Invalid Date");
  };

  // Function to load and process payroll data
  const loadPayrollData = useCallback(() => {
    try {
      const existingReports = localStorage.getItem("payrollReportsHistory");
      let reports: ReportData[] = [];

      if (existingReports) {
        const parsedReports: StoredPayrollData[] = JSON.parse(existingReports);
        if (!Array.isArray(parsedReports)) {
          throw new Error("Invalid payroll reports history format");
        }

        reports = parsedReports.map((payrollData: StoredPayrollData, index: number) => {
          const parsedRunDate = parseDate(payrollData.runDate);
          const uniqueId =
            payrollData.id || `PAY${Date.now().toString().slice(-6)}_${index}`;

          return {
            id: uniqueId,
            period: payrollData.period,
            date: isValid(parsedRunDate)
              ? format(parsedRunDate, "yyyy-MM-dd")
              : format(new Date(), "yyyy-MM-dd"),
            totalEmployees: payrollData.employees?.length || 0,
            totalHours:
              payrollData.employees?.reduce(
                (sum: number, emp: StoredEmployee) => sum + (Number(emp.hoursWorked) || 0),
                0
              ) || 0,
            totalGross:
              payrollData.employees?.reduce(
                (sum: number, emp: StoredEmployee) => sum + (Number(emp.gross) || 0),
                0
              ) || 0,
            totalTax:
              payrollData.employees?.reduce(
                (sum: number, emp: StoredEmployee) => sum + (Number(emp.tax) || 0),
                0
              ) || 0,
            totalNet:
              payrollData.employees?.reduce(
                (sum: number, emp: StoredEmployee) => sum + (Number(emp.net) || 0),
                0
              ) || 0,
            status: "Completed",
            employees: payrollData.employees || [],
          };
        });
      }

      const latestPayrollData = localStorage.getItem("latestPayrollData");
      if (latestPayrollData) {
        const payrollData: StoredPayrollData = JSON.parse(latestPayrollData);
        if (
          payrollData?.period &&
          payrollData?.runDate &&
          Array.isArray(payrollData?.employees)
        ) {
          const parsedRunDate = parseDate(payrollData.runDate);
          if (isValid(parsedRunDate)) {
            const uniqueId = `PAY${Date.now()
              .toString()
              .slice(-6)}_${Math.random()
              .toString(36)
              .substr(2, 3)
              .toUpperCase()}`;

            const newReport: ReportData = {
              id: uniqueId,
              period: payrollData.period,
              date: format(parsedRunDate, "yyyy-MM-dd"),
              totalEmployees: payrollData.employees.length,
              totalHours: payrollData.employees.reduce(
                (sum: number, emp: StoredEmployee) => sum + (Number(emp.hoursWorked) || 0),
                0
              ),
              totalGross: payrollData.employees.reduce(
                (sum: number, emp: StoredEmployee) => sum + (Number(emp.gross) || 0),
                0
              ),
              totalTax: payrollData.employees.reduce(
                (sum: number, emp: StoredEmployee) => sum + (Number(emp.tax) || 0),
                0
              ),
              totalNet: payrollData.employees.reduce(
                (sum: number, emp: StoredEmployee) => sum + (Number(emp.net) || 0),
                0
              ),
              status: "Completed",
              employees: payrollData.employees,
            };

            const exists = reports.some(
              (report) =>
                report.period === newReport.period &&
                Math.abs(
                  parseDate(report.date).getTime() -
                    parseDate(newReport.date).getTime()
                ) < 60000 &&
                report.totalGross === newReport.totalGross &&
                report.totalEmployees === newReport.totalEmployees
            );

            if (!exists) {
              reports = [newReport, ...reports];
              setNewPayrollAdded(true);

              const updatedPayrollHistory = reports.map((report) => ({
                id: report.id,
                period: report.period,
                runDate: report.date,
                employees: report.employees || [],
              }));
              localStorage.setItem(
                "payrollReportsHistory",
                JSON.stringify(updatedPayrollHistory)
              );

              localStorage.removeItem("latestPayrollData");
            }
          }
        }
      }

      const sortedReports = reports.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setReportData(sortedReports);
    } catch (err) {
      console.error("Error loading payroll data:", err);
      setError("Failed to load payroll data. Please try again.");
    }
  }, [setReportData, setNewPayrollAdded, setError]);

  // Validate date range
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const start = parseISO(dateRange.start);
      const end = parseISO(dateRange.end);
      if (isValid(start) && isValid(end) && start > end) {
        setError("End date must be after start date.");
      } else {
        setError(null);
      }
    }
  }, [dateRange]);

  // Load data on mount and set up polling for updates
  useEffect(() => {
    loadPayrollData();
    const interval = setInterval(() => {
      const latestPayrollData = localStorage.getItem("latestPayrollData");
      if (latestPayrollData) {
        loadPayrollData();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [loadPayrollData]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "latestPayrollData" && e.newValue) {
        loadPayrollData();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadPayrollData]);

  // Export to Excel
  const exportToExcel = (reportId?: string) => {
    const reportsToExport = reportId
      ? filteredReports.filter((report) => report.id === reportId)
      : filteredReports;

    const worksheetData = reportsToExport.flatMap((report) => {
      const reportSummary = {
        "Payroll ID": report.id,
        Period: report.period,
        Date: isValid(parseDate(report.date))
          ? format(parseDate(report.date), "MMMM dd, yyyy")
          : "Invalid Date",
        "Total Employees": report.totalEmployees,
        "Total Hours": report.totalHours,
        "Total Gross Pay": report.totalGross.toFixed(2),
        "Total Deductions": report.totalTax.toFixed(2),
        "Total Net Pay": report.totalNet.toFixed(2),
        Status: report.status,
      };

      const employeeRows = (report.employees || []).map((emp: Employee) => ({
        "Payroll ID": report.id,
        "Employee ID": emp.id,
        "Employee Name": emp.name,
        Department: emp.department,
        "Regular Hours": emp.regularHours,
        "Overtime Hours": emp.overtimeHours,
        "Hourly Rate": emp.hourlyRate.toFixed(2),
        "Gross Pay": emp.gross.toFixed(2),
        "Federal Tax": emp.federalTax.toFixed(2),
        "State Tax": emp.stateTax.toFixed(2),
        "Social Security": emp.socialSecurity.toFixed(2),
        Medicare: emp.medicare.toFixed(2),
        "Total Deductions": emp.tax.toFixed(2),
        "Net Pay": emp.net.toFixed(2),
      }));

      return [reportSummary, ...employeeRows];
    });

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Report");
    XLSX.writeFile(
      wb,
      `Payroll_Report_${reportId || format(new Date(), "yyyy-MM-dd")}.xlsx`
    );
  };

  // Delete report function
  const deleteReport = (reportId: string) => {
    if (confirm("Are you sure you want to delete this payroll report?")) {
      setReportData((prev) => {
        const updatedReports = prev.filter((report) => report.id !== reportId);
        const updatedPayrollHistory = updatedReports.map((report) => ({
          id: report.id,
          period: report.period,
          runDate: report.date,
          employees: report.employees || [],
        }));
        localStorage.setItem(
          "payrollReportsHistory",
          JSON.stringify(updatedPayrollHistory)
        );
        return updatedReports;
      });
    }
  };

  // Clear all reports function
  const clearAllReports = () => {
    if (
      confirm(
        "Are you sure you want to delete ALL payroll reports? This action cannot be undone."
      )
    ) {
      setReportData([]);
      localStorage.removeItem("payrollReportsHistory");
      localStorage.removeItem("latestPayrollData");
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    let filtered = reportData;

    if (selectedPeriod !== "all") {
      filtered = filtered.filter((report) =>
        report.period.toLowerCase().includes(selectedPeriod.toLowerCase())
      );
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((report) => {
        try {
          const reportDate = parseDate(report.date);
          const startDate = parseISO(dateRange.start);
          const endDate = parseISO(dateRange.end);
          if (
            !isValid(reportDate) ||
            !isValid(startDate) ||
            !isValid(endDate)
          ) {
            return false;
          }
          return isWithinInterval(reportDate, {
            start: startDate,
            end: endDate,
          });
        } catch {
          return false;
        }
      });
    }

    return filtered.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [reportData, selectedPeriod, dateRange]);

  // Paginated reports
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    return filteredReports.slice(startIndex, startIndex + reportsPerPage);
  }, [filteredReports, currentPage]);

  // Totals derived from filteredReports
  const totals = useMemo<Totals>(() => {
    return filteredReports.reduce(
      (totals, report) => ({
        totalEmployees: totals.totalEmployees + report.totalEmployees,
        totalHours: totals.totalHours + report.totalHours,
        totalGross: totals.totalGross + report.totalGross,
        totalTax: totals.totalTax + report.totalTax,
        totalNet: totals.totalNet + report.totalNet,
        totalReports: totals.totalReports + 1,
      }),
      {
        totalEmployees: 0,
        totalHours: 0,
        totalGross: 0,
        totalTax: 0,
        totalNet: 0,
        totalReports: 0,
      }
    );
  }, [filteredReports]);

  // Get unique periods for filter dropdown
  const uniquePeriods = useMemo(() => {
    const periods = [
      ...new Set(
        reportData.map((report) => {
          const datePart = report.period.split(" - ")[0];
          return datePart;
        })
      ),
    ].sort();
    return periods;
  }, [reportData]);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 space-y-6">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-xl shadow-md">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="text-center py-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Payroll Reports
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          View and analyze historical payroll data with customizable filters
        </p>
        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/payroll"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            ← Back to Payroll Processing
          </Link>
          <button
            onClick={() => exportToExcel()}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
            disabled={filteredReports.length === 0}
          >
            Export All to Excel
          </button>
          <button
            onClick={clearAllReports}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
            disabled={reportData.length === 0}
          >
            Clear All Reports
          </button>
        </div>
      </div>

      {newPayrollAdded && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-xl shadow-md">
          <div className="flex items-center justify-between">
            <span>🎉 New payroll data has been added to your reports!</span>
            <button
              onClick={() => setNewPayrollAdded(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Reports"
          value={totals.totalReports.toString()}
          icon="📊"
          color="blue"
        />
        <SummaryCard
          title="Total Hours"
          value={totals.totalHours.toString()}
          icon="⏰"
          color="green"
        />
        <SummaryCard
          title="Total Gross Pay"
          value={`$${totals.totalGross.toFixed(2)}`}
          icon="💰"
          color="yellow"
        />
        <SummaryCard
          title="Total Net Pay"
          value={`$${totals.totalNet.toFixed(2)}`}
          icon="💵"
          color="purple"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Report Filters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pay Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            >
              <option value="all">All Periods</option>
              {uniquePeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setSelectedPeriod("all");
              setDateRange({ start: "", end: "" });
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Payroll History
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredReports.length} of {reportData.length} reports
          </p>
        </div>

        {paginatedReports.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            {reportData.length === 0
              ? "No reports available. Process a payroll to add reports."
              : "No reports match your current filters."}
          </div>
        ) : (
          <>
            <div className="block sm:hidden">
              {paginatedReports.map((report, index) => (
                <div
                  key={report.id}
                  className={`p-4 border-t ${
                    index === 0 && newPayrollAdded
                      ? "bg-blue-50"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-blue-600 text-sm">
                      {report.id}
                      {index === 0 && newPayrollAdded && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => exportToExcel(report.id)}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Excel
                      </button>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {report.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {report.period}
                  </p>
                  <p className="text-xs text-gray-600">
                    {isValid(parseDate(report.date))
                      ? format(parseDate(report.date), "MMMM dd, yyyy")
                      : "Invalid Date"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Employees: {report.totalEmployees}
                  </p>
                  <p className="text-xs text-gray-600">
                    Hours: {report.totalHours}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    Gross: ${report.totalGross.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-red-500">
                    Deductions: -${report.totalTax.toFixed(2)}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Net: ${report.totalNet.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Payroll ID
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Period
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Date
                    </th>
                    <th className="p-4 text-right font-medium text-gray-900">
                      Employees
                    </th>
                    <th className="p-4 text-right font-medium text-gray-900 hidden md:table-cell">
                      Hours
                    </th>
                    <th className="p-4 text-right font-medium text-gray-900">
                      Gross Pay
                    </th>
                    <th className="p-4 text-right font-medium text-gray-900 hidden lg:table-cell">
                      Deductions
                    </th>
                    <th className="p-4 text-right font-medium text-gray-900">
                      Net Pay
                    </th>
                    <th className="p-4 text-center font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.map((report, index) => (
                    <tr
                      key={report.id}
                      className={`border-t hover:bg-gray-50 transition-colors ${
                        index === 0 && newPayrollAdded
                          ? "bg-blue-50"
                          : index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                      }`}
                    >
                      <td className="p-4 font-mono text-blue-600 text-sm">
                        {report.id}
                        {index === 0 && newPayrollAdded && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-medium text-gray-900 text-sm">
                        {report.period}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {isValid(parseDate(report.date))
                          ? format(parseDate(report.date), "MMMM dd, yyyy")
                          : "Invalid Date"}
                      </td>
                      <td className="p-4 text-right text-gray-600 text-sm">
                        {report.totalEmployees}
                      </td>
                      <td className="p-4 text-right text-gray-600 text-sm hidden md:table-cell">
                        {report.totalHours}
                      </td>
                      <td className="p-4 text-right font-semibold text-green-600 text-sm">
                        ${report.totalGross.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-semibold text-red-500 text-sm hidden lg:table-cell">
                        -${report.totalTax.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-bold text-gray-900 text-sm">
                        ${report.totalNet.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => exportToExcel(report.id)}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {report.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {filteredReports.length > reportsPerPage && (
          <div className="p-4 flex justify-between items-center border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of{" "}
              {Math.ceil(filteredReports.length / reportsPerPage)}(
              {(currentPage - 1) * reportsPerPage + 1}-
              {Math.min(currentPage * reportsPerPage, filteredReports.length)}{" "}
              of {filteredReports.length})
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage * reportsPerPage >= filteredReports.length}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {filteredReports.length > 0 &&
        filteredReports.length !== reportData.length && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Filtered Results Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totals.totalReports}
                </div>
                <div className="text-gray-600">Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totals.totalHours}
                </div>
                <div className="text-gray-600">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  ${totals.totalGross.toFixed(0)}
                </div>
                <div className="text-gray-600">Gross</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  ${totals.totalTax.toFixed(0)}
                </div>
                <div className="text-gray-600">Tax</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${totals.totalNet.toFixed(0)}
                </div>
                <div className="text-gray-600">Net</div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}