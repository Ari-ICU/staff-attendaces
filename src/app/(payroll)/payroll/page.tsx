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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PayrollSection/>
      </div>
    
    </div>
  );
}

export default page
