// components/RoleList.tsx
import RoleCard from "./RoleCard";

interface Role {
  id: number;
  title: string;
  description: string;
  department: string;
}

interface RoleListProps {
  roles: Role[];
}

export default function RoleList({ roles }: RoleListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          title={role.title}
          description={role.description}
          department={role.department}
        />
      ))}
    </div>
  );
}
