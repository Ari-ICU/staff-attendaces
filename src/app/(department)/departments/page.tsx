"use client";

import DepartmentList from "@/components/department/DepartmentList";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";

export default function DepartmentsPage() {
  const router = useRouter();

  const departments = [
    {
      id: 1,
      name: "Human Resources",
      description: "Handles recruitment and employee welfare.",
      staffCount: 12,
    },
    {
      id: 2,
      name: "Finance",
      description: "Manages budgets and financial planning.",
      staffCount: 8,
    },
    {
      id: 3,
      name: "IT",
      description: "Maintains infrastructure and systems.",
      staffCount: 15,
    },
    {
      id: 4,
      name: "Marketing",
      description: "Promotes company products and manages branding.",
      staffCount: 10,
    },
    {
      id: 5,
      name: "Research & Development",
      description: "Focuses on innovation and new product development.",
      staffCount: 7,
    },
    {
      id: 6,
      name: "Customer Support",
      description: "Helps clients and ensures customer satisfaction.",
      staffCount: 20,
    },
  ];
  
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Departments
        </h1>

        <button
          onClick={() => router.push("/departments/add")}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm sm:text-base shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Add a new department"
        >
          <FiPlus />
          Add New Department
        </button>
      </div>

      {/* Department List */}
      <DepartmentList departments={departments} />
    </div>
  );
}
