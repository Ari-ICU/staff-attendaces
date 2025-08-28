
import DepartmentCard, { Color } from './DepartmentCard';

interface Department {
  id: number;
  name: string;
  description: string;
  staffCount: number;
  color?: Color; // Use the imported Color type
}

interface DepartmentListProps {
  departments: Department[];
}

export default function DepartmentList({ departments }: DepartmentListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept.id}
          name={dept.name}
          description={dept.description}
          staffCount={dept.staffCount}
          color={dept.color ?? 'blue'} // Use nullish coalescing for default
        />
      ))}
    </div>
  );
}
