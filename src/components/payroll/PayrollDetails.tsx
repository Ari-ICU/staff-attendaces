"use client";

import { PayrollReport } from "@/types/payroll";

interface PayrollDetailsProps {
  report: PayrollReport;
  onClose: () => void;
}

export default function PayrollDetails({ report, onClose }: PayrollDetailsProps) {
  const totalEarnings = report.earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = report.deductions?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const transactionId = `TXN-${report.id}-${report.paymentDate.replace(/-/g, "")}`;
  const notes = report.notes || "Payment processed via direct deposit.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 sm:p-8 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Payroll Details
          </h2>
          <button onClick={onClose} aria-label="Close modal" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Employee */}
          <div className="flex items-center gap-4">
            <span className="text-3xl">👤</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{report.employeeName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Employee ID: {report.employeeId}</p>
            </div>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</p>
            <p className="text-gray-900 dark:text-gray-100">{report.role}</p>
          </div>

          {/* Earnings */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Earnings</p>
            {report.earnings.map((item, idx) => (
              <p key={idx} className="text-gray-900 dark:text-gray-100">{item.type}: ${item.amount.toLocaleString()}</p>
            ))}
            <p className="font-semibold text-gray-900 dark:text-gray-100">Total: ${totalEarnings.toLocaleString()}</p>
          </div>

          {/* Deductions */}
          {report.deductions && report.deductions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Deductions</p>
              {report.deductions.map((item, idx) => (
                <p key={idx} className="text-gray-900 dark:text-gray-100">{item.type}: ${item.amount.toLocaleString()}</p>
              ))}
              <p className="font-semibold text-gray-900 dark:text-gray-100">Total: ${totalDeductions.toLocaleString()}</p>
            </div>
          )}

          {/* Payment Date */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Date</p>
            <p className="text-gray-900 dark:text-gray-100">{report.paymentDate}</p>
          </div>

          {/* Transaction ID */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</p>
            <p className="text-gray-900 dark:text-gray-100">{transactionId}</p>
          </div>

          {/* Notes */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</p>
            <p className="text-gray-900 dark:text-gray-100">{notes}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            Close
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => alert("Download functionality not implemented")}>
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
