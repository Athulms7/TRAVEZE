import { Link } from "react-router-dom";
import { LogOut, Settings2, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AccountMenu = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();

  if (isLoading || !isAuthenticated || !user) return null;

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Signed out", description: "You have been securely signed out." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signed out on this device",
        description: error instanceof Error
          ? `${error.message} This token will remain usable only until its expiry.`
          : "The server could not revoke this session. This token will remain usable only until its expiry.",
      });
    }
  };

  return (
    <div className="fixed right-4 top-4 z-[60] sm:right-6 sm:top-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Account menu for ${user.name}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/95 text-sm font-semibold text-vander-teal shadow-lg shadow-slate-900/10 transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vander-teal focus-visible:ring-offset-2"
          >
            {initials || <UserRound size={19} aria-hidden="true" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-2xl p-2">
          <DropdownMenuLabel className="px-3 py-2">
            <span className="block truncate text-sm font-semibold text-vander-dark">{user.name}</span>
            <span className="mt-0.5 block truncate text-xs font-normal text-vander-gray">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5">
            <Link to="/profile">
              <Settings2 size={16} className="mr-2 text-vander-teal" aria-hidden="true" />
              Profile settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              void handleLogout();
            }}
            className="cursor-pointer rounded-xl px-3 py-2.5 text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <LogOut size={16} className="mr-2" aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccountMenu;
