"use client";

import { useState } from "react";
import PayrollTable from "@/components/payroll/PayrollTable";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface Payroll {
  id: number;
  name: string;
  role: string;
  salary: number;
  status: "Pending" | "Paid";
  paymentDate?: string;
}

const samplePayroll: Payroll[] = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "HR Manager",
    salary: 1200,
    status: "Pending",
  },
  {
    id: 2,
    name: "John Smith",
    role: "Developer",
    salary: 1500,
    status: "Pending",
  },
  {
    id: 3,
    name: "Sophia Lee",
    role: "Finance Officer",
    salary: 1300,
    status: "Paid",
    paymentDate: "2025-08-25",
  },
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState(samplePayroll);

  const runAllPayrolls = () => {
    setPayrolls((prev) =>
      prev.map((p) =>
        p.status === "Pending"
          ? {
              ...p,
              status: "Paid",
              paymentDate: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );
  };

  const hasPendingPayrolls = payrolls.some((p) => p.status === "Pending");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={runAllPayrolls}
          className="bg-green-600  flex items-center gap-2"
          disabled={!hasPendingPayrolls}
        >
          <DollarSign className="w-4 h-4" />
          {hasPendingPayrolls ? "Run All Payrolls" : "All Paid"}
        </Button>
      </div>
      <PayrollTable payrolls={payrolls} setPayrolls={setPayrolls} />
    </div>
  );
}
