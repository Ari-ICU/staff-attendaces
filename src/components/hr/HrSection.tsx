'use client';

import Link from "next/link";
import { Users } from "lucide-react";

interface HrSectionProps {
  title: string;
  description: string;
  link: string;
}

export default function HrSection({ title, description, link }: HrSectionProps) {
  return (
    <Link
      href={link}
      className="block p-6 border rounded-xl shadow hover:shadow-md transition bg-white dark:bg-gray-900"
    >
      <div className="flex items-center space-x-3 mb-2">
        <Users className="h-6 w-6 text-blue-500" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </Link>
  );
}
