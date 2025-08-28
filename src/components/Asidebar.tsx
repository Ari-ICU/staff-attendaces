"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback, memo } from "react";
import clsx from "clsx";

// --- Icons ---
const DashboardIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={clsx(
      "w-4 h-4 transition-transform duration-300",
      isOpen && "rotate-90"
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// --- Types ---
interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavSection {
  label: string;
  icon?: React.ReactNode;
  links: NavLink[];
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

// --- Navigation Data ---
const NAV_SECTIONS: NavSection[] = [
  {
    label: "Dashboard",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    ],
  },
  {
    label: "Management Staff",
    icon: <UsersIcon />,
    links: [
      { href: "/staff-list", label: "Staff List", icon: <UsersIcon /> },
      { href: "/staff-checkin", label: "Check-in", icon: <UsersIcon /> },
      { href: "/staff-checkout", label: "Check-out", icon: <UsersIcon /> },
      { href: "/staff-leave", label: "Leave Requests", icon: <UsersIcon /> },
    ],
  },
  {
    label: "Departments",
    icon: <UsersIcon />,
    links: [
      { href: "/departments", label: "All Departments", icon: <UsersIcon /> },
      { href: "/roles", label: "Roles", icon: <UsersIcon /> },
    ],
  },
  {
    label: "Reports",
    icon: <UsersIcon />,
    links: [
      {
        href: "/attendance-report",
        label: "Attendance Report",
        icon: <UsersIcon />,
      },
      { href: "/leave-report", label: "Leave Report", icon: <UsersIcon /> },
    ],
  },
];

// --- Memoized LinkItem ---
const LinkItem = memo(
  ({
    href,
    label,
    icon,
    isActive,
    onClick,
  }: NavLink & { isActive: boolean; onClick: () => void }) => (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
        isActive
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
      )}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      {icon && (
        <span
          className={clsx(
            "flex-shrink-0 transition-transform duration-200",
            isActive
              ? "text-white"
              : "text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          )}
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full opacity-80"></span>
      )}
    </Link>
  )
);

LinkItem.displayName = "LinkItem";

// --- Sidebar Component ---
export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const closeSidebar = useCallback(
    () => setIsSidebarOpen(false),
    [setIsSidebarOpen]
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-full w-72 bg-white dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 shadow-2xl transform transition-all duration-300 ease-in-out",
          "md:static md:translate-x-0 md:w-64 lg:w-72",
          isSidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 md:opacity-100"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              StaffFlow
            </h2>
          )}
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_SECTIONS.map((section) => {
            const isOpen = openSections[section.label] ?? false;

            return (
              <div key={section.label} className="mt-2">
                {/* Section Header */}
                {section.links.length > 1 ? (
                  <button
                    type="button"
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    )}
                    onClick={() => toggleSection(section.label)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <span>{section.label}</span>
                    </div>
                    <ChevronIcon isOpen={isOpen} />
                  </button>
                ) : null}

                {/* Links */}
                <div
                  className={clsx(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen || section.links.length === 1
                      ? "max-h-60 mt-1 space-y-1 opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-2">
                    {section.links.map((link) => (
                      <LinkItem
                        key={link.href}
                        {...link}
                        isActive={pathname === link.href}
                        onClick={closeSidebar}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {/* <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 hidden md:block">
          © {new Date().getFullYear()} StaffFlow. All rights reserved.
        </div> */}
      </aside>
    </>
  );
}
