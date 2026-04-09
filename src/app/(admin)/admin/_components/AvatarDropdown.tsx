import { CircleUserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionStore } from "@/stores/use-session-store";

interface Props {
  name: string;
  email: string;
}

export default function AvatarDropdown({ email, name }: Props) {
  const { signOut } = useSessionStore();

  const loggout = () => {
    signOut();
    window.location.href = "/login";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          aria-label="Open account menu"
          className="bg-slate-800 border-emerald-500/30 hover:bg-slate-700 hover:border-emerald-500 text-white"
        >
          <CircleUserRoundIcon
            size={20}
            aria-hidden="true"
            className="text-emerald-400"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 bg-slate-800 border-emerald-500/30 text-white">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-white">{name}</span>
          <span className="text-emerald-400 text-xs font-normal">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-emerald-500/20" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
            Help & Support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-emerald-500/20" />
        <DropdownMenuItem asChild>
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            variant="default"
            onClick={loggout}
          >
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}