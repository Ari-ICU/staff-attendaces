// components/RoleCard.tsx
interface RoleCardProps {
  title: string;
  description: string;
  department?: string;
  icon?: React.ReactNode; // Optional icon for visual enhancement
}

export default function RoleCard({ title, description, department, icon }: RoleCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Optional Icon */}
      {icon && (
        <div className="mb-4 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-3 text-gray-600 leading-relaxed dark:text-gray-300">
        {description}
      </p>

      {/* Department Tag */}
      {department && (
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600">
          {department}
        </span>
      )}
    </div>
  );
}