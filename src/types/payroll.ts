// types/payroll.ts
export interface PayrollItem {
  id: number;
  description: string;
  amount: number;
}

export interface PayrollReport {
  id: number;
  employeeName: string;
  employeeId: string;
  role: string;
  companyName: string;
  companyAddress: string;
  paymentDate: string;
  earnings: { type: string; amount: number }[];
  deductions?: { type: string; amount: number }[];
  notes?: string;
}
