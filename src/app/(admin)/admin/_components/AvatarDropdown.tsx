import { CircleUserRoundIcon, LogOut, Settings, HelpCircle } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardGuide } from "@/app/_components/DashboardGuide";
import { useLogout } from "@/app/hooks/use-logout";

interface Props {
  name: string;
  email: string;
}

export default function AvatarDropdown({ email, name }: Props) {
  const { currentUser } = useSessionStore();
  const { logout, isLoading } = useLogout();
  const router = useRouter();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleSettingsClick = () => {
    if (currentUser?.role === 'INFLUENCER') {
      router.push('/influencer/settings');
    } else if (currentUser?.role === 'COMPANY') {
      router.push('/company/settings');
    } else if (currentUser?.role === 'ADMIN') {
      router.push('/admin/settings');
    }
  };

  const displayName = currentUser?.name && currentUser.name.trim() !== "" ? currentUser.name : (name && name.trim() !== "" ? name : "User");

  return (
    <>
      <DashboardGuide 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
        role={currentUser?.role}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 transition-all duration-300 group focus:outline-none">
            <Avatar className="w-10 h-10 border-2 border-white shadow-soft group-hover:scale-105 transition-transform duration-300">
              <AvatarImage src={currentUser?.profilePicture} className="object-cover" />
              <AvatarFallback className="bg-black text-white text-xs font-bold">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start mr-2 text-left">
              <p className="text-sm font-bold text-black leading-none mb-1 group-hover:text-gray-700 transition-colors truncate max-w-[150px]">{displayName}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{currentUser?.role?.toLowerCase() || 'User'}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white border-2 border-black/5 rounded-3xl p-2 shadow-large mt-2 animate-fadeInUp">
          <DropdownMenuLabel className="p-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-black text-black tracking-tight">{displayName}</p>
              <p className="text-xs font-medium text-gray-500 truncate">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-black/5 mx-2" />
          <DropdownMenuGroup className="p-2">
            <DropdownMenuItem onClick={handleSettingsClick} className="flex items-center gap-3 p-3 rounded-xl focus:bg-gray-50 focus:text-black cursor-pointer group transition-all">
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              <span className="text-sm font-bold text-gray-600 group-hover:text-black">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-3 p-3 rounded-xl focus:bg-gray-50 focus:text-black cursor-pointer group transition-all"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              <span className="text-sm font-bold text-gray-600 group-hover:text-black">Help & Support</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-black/5 mx-2" />
          <div className="p-2">
            <button
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 text-sm font-bold shadow-soft transition-all hover:scale-[1.02] group disabled:opacity-50"
              onClick={logout}
              disabled={isLoading}
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}