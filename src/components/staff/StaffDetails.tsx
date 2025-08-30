"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface Staff {
  id: number;
  name: string;
  department: string;
  role: string;
  image?: string;
}

type StaffDetailKey =
  | "department"
  | "role"
  | "email"
  | "phone"
  | "hireDate"
  | "location";

interface StaffDetailsProps {
  staff: Staff;
  onClose: () => void;
}

export default function StaffDetails({ staff, onClose }: StaffDetailsProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const focusableElements: HTMLElement[] = modalRef.current
      ? Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        )
      : [];

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("keydown", handleTab);
    modalRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("keydown", handleTab);
    };
  }, [onClose]);

  const staffDetails = {
    ...staff,
    email: `${staff.name.toLowerCase().replace(/\s+/g, ".")}@company.com`,
    phone: "+1-555-123-4567",
    hireDate: "2023-01-15",
    location: "Main Office",
  };

  const keys: StaffDetailKey[] = [
    "department",
    "role",
    "email",
    "phone",
    "hireDate",
    "location",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-labelledby="staff-modal-title"
        aria-modal="true"
        tabIndex={-1}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden border border-gray-200 dark:border-gray-800 transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image and Name */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <div className="relative inline-block mb-4">
            {staff.image ? (
              <Image
                src="/avatars/jane.png"
                alt="Jane Doe"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 border-4 border-white dark:border-gray-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {staff.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h2
            id="staff-modal-title"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            {staffDetails.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {staffDetails.role}
          </p>
        </div>

        {/* Details Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {keys.map((key) => (
            <div key={key} className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {key === "hireDate"
                  ? "Hire Date"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <p className="text-gray-800 dark:text-gray-100 text-sm sm:text-base break-words">
                {staffDetails[key]}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-5 sm:p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-px transition-all duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => alert("Edit functionality not implemented")}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
