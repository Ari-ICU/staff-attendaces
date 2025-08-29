"use client";

import { Dispatch, SetStateAction, useState, useMemo, lazy } from "react";
import { Button } from "@/components/ui/button";

interface Payroll {
  id: number;
  name: string;
  role: string;
  salary: number;
  status: "Pending" | "Paid";
  paymentDate?: string;
}

export default function PayrollTable({
  payrolls,
  setPayrolls,
}: {
  payrolls: Payroll[];
  setPayrolls: Dispatch<SetStateAction<Payroll[]>>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payroll;
    direction: "asc" | "desc";
  }>({
    key: "name",
    direction: "asc",
  });

  const runPayroll = (id: number) => {
    setPayrolls((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "Paid",
              paymentDate: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );
  };

  const filteredPayrolls = useMemo(() => {
    let filtered = [...payrolls];

    if (searchTerm) {
      filtered = filtered.filter(
        (payroll) =>
          payroll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payroll.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      // If sorting by number, cast to number
      if (sortConfig.key === "salary") {
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Otherwise, compare as strings
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [payrolls, searchTerm, sortConfig]);

  const handleSort = (key: keyof Payroll) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <>
      {/* SEO Meta */}
      <title>Payroll Management | StaffFlow</title>
      <meta
        name="description"
        content="Manage payroll with search, sort, and detailed views, including payment status and actions."
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            💰 Payroll Management
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search, sort, and manage payroll records with ease.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
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
              aria-label="Search payroll records"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block max-w-6xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-600 dark:from-gray-900 dark:to-gray-850 text-gray-900 dark:text-gray-300 uppercase tracking-wide text-xs sm:text-sm">
                {(
                  [
                    "name",
                    "role",
                    "salary",
                    "status",
                    "paymentDate",
                  ] as (keyof Payroll)[]
                ).map((key) => (
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
                        {sortConfig.key === key &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="p-4 font-semibold">Actions</th>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredPayrolls.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📊</span>
                        <p className="text-base">
                          No payroll records found matching your criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayrolls.map((payroll) => (
                    <tr
                      key={payroll.id}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-[1.002]"
                    >
                      <td className="p-4 text-gray-900 dark:text-gray-100">
                        {payroll.name}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        {payroll.role}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        ${payroll.salary.toLocaleString()}
                      </td>
                      <td
                        className={`p-4 ${
                          payroll.status === "Paid"
                            ? "text-green-600"
                            : "text-red-600"
                        } dark:text-${
                          payroll.status === "Paid" ? "green-400" : "red-400"
                        }`}
                      >
                        {payroll.status}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {payroll.paymentDate || "-"}
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <Button
                          onClick={() => runPayroll(payroll.id)}
                          className={`text-white text-sm ${
                            payroll.status === "Paid"
                              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                          } transition-colors duration-200`}
                          disabled={payroll.status === "Paid"}
                        >
                          {payroll.status === "Paid"
                            ? "Payroll Completed"
                            : "Run Payroll"}
                        </Button>
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
          {filteredPayrolls.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-md backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">📊</span>
                <p className="text-sm">
                  No payroll records found matching your criteria.
                </p>
              </div>
            </div>
          ) : (
            filteredPayrolls.map((payroll) => (
              <div
                key={payroll.id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {payroll.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {payroll.role} • ${payroll.salary.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      payroll.status === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    } dark:text-${
                      payroll.status === "Paid" ? "green-400" : "red-400"
                    }`}
                  >
                    Status: {payroll.status}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Paid on: {payroll.paymentDate || "-"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => runPayroll(payroll.id)}
                    className={`text-white text-sm ${
                      payroll.status === "Paid"
                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    } transition-colors duration-200`}
                    disabled={payroll.status === "Paid"}
                  >
                    {payroll.status === "Paid"
                      ? "Payroll Completed"
                      : "Run Payroll"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
