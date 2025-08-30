'use client';
import Image from "next/image";
interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar?: string; // optional image URL
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="group relative flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-5 hover:scale-105 transition-transform duration-300">
      {/* Avatar */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover"
            width={80}
            height={80}
          />
        ) : (
          <span className="text-gray-500 dark:text-gray-300 font-bold text-lg">
            {member.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Info */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white text-center">
        {member.name}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
        {member.role}
      </p>
    </div>
  );
}
