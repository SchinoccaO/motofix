import { Link } from "react-router-dom";
import type { AuthUser } from "../services/api";

const COLORS = ["#E53E3E", "#DD6B20", "#38A169", "#3182CE", "#805AD5", "#D53F8C"];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function UserAvatar({ user }: { user: AuthUser }) {
  return (
    <Link to="/mi-perfil" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
      <span className="text-sm font-medium text-[#5c584a] dark:text-gray-300 hidden sm:inline">
        {user.name.split(" ")[0]}
      </span>
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs overflow-hidden flex-shrink-0"
        style={{ backgroundColor: user.avatar_url ? undefined : getColor(user.name) }}
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          getInitials(user.name)
        )}
      </div>
    </Link>
  );
}
