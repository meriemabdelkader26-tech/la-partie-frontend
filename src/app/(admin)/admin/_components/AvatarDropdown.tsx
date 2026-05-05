import { CircleUserRoundIcon, LogOut, Settings, HelpCircle, UserCheck, UserX, Clock, ChevronRight } from "lucide-react";
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
import { useState, useEffect } from "react";
import { DashboardGuide } from "@/app/_components/DashboardGuide";
import { useLogout } from "@/app/hooks/use-logout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_AVAILABILITY, UPDATE_INFLUENCER_AVAILABILITY, UPDATE_COMPANY_AVAILABILITY } from "@/lib/queries/availability-queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  email: string;
}

const AVAILABILITY_OPTIONS = [
  { value: "disponible", label: "Available", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  { value: "partiellement_disponible", label: "Partial", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  { value: "occupe", label: "Busy", icon: UserX, color: "text-rose-500", bg: "bg-rose-50" },
];

export default function AvatarDropdown({ email, name }: Props) {
  const { currentUser } = useSessionStore();
  const { logout, isLoading } = useLogout();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const { data: availabilityData } = useQuery({
    queryKey: ["myAvailability"],
    queryFn: () => graphqlClient.request<any>(GET_MY_AVAILABILITY),
    enabled: !!currentUser,
    refetchInterval: 5000, // Refetch every 5 seconds to keep synced
  });

  const currentAvailability = currentUser?.role === "INFLUENCER" 
    ? availabilityData?.myInfluencerProfile?.disponibiliteCollaboration 
    : availabilityData?.myCompanyProfile?.disponibiliteCollaboration;

  const updateInfluencerMutation = useMutation({
    mutationFn: (val: string) => graphqlClient.request(UPDATE_INFLUENCER_AVAILABILITY, { disponibiliteCollaboration: val.toUpperCase() }),
    onSuccess: () => {
      toast.success("Availability updated");
      queryClient.invalidateQueries({ queryKey: ["myAvailability"] });
    }
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (val: string) => graphqlClient.request(UPDATE_COMPANY_AVAILABILITY, { disponibiliteCollaboration: val }),
    onSuccess: () => {
      toast.success("Availability updated");
      queryClient.invalidateQueries({ queryKey: ["myAvailability"] });
    }
  });

  const handleAvailabilityChange = (val: string) => {
    if (currentUser?.role === "INFLUENCER") {
      updateInfluencerMutation.mutate(val);
    } else if (currentUser?.role === "COMPANY") {
      updateCompanyMutation.mutate(val);
    }
  };

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

  const currentOption = AVAILABILITY_OPTIONS.find(opt => opt.value === currentAvailability) || AVAILABILITY_OPTIONS[0];

  return (
    <>
      <DashboardGuide 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
        role={currentUser?.role}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 transition-all duration-300 group focus:outline-none relative">
            <div className="relative">
              <Avatar className="w-10 h-10 border-2 border-white shadow-soft group-hover:scale-105 transition-transform duration-300">
                <AvatarImage src={currentUser?.profilePicture} className="object-cover" />
                <AvatarFallback className="bg-black text-white text-xs font-bold">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-all duration-500",
                !currentAvailability ? "bg-gray-300 animate-pulse" :
                currentAvailability.toLowerCase() === "disponible" ? "bg-emerald-500" : 
                currentAvailability.toLowerCase() === "partiellement_disponible" ? "bg-amber-500" : "bg-rose-500"
              )} />
            </div>
            <div className="hidden md:flex flex-col items-start mr-2 text-left">
              <p className="text-sm font-bold text-black leading-none mb-1 group-hover:text-gray-700 transition-colors truncate max-w-[150px]">{displayName}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{currentUser?.role?.toLowerCase() || 'User'}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-white border-2 border-black/5 rounded-3xl p-2 shadow-large mt-2 animate-fadeInUp">
          <DropdownMenuLabel className="p-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-black text-black tracking-tight">{displayName}</p>
              <p className="text-xs font-medium text-gray-500 truncate">{email}</p>
            </div>
          </DropdownMenuLabel>
          
          {(currentUser?.role === "INFLUENCER" || currentUser?.role === "COMPANY") && (
            <>
              <DropdownMenuSeparator className="bg-black/5 mx-2" />
              <div className="p-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">My Availability</p>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAvailabilityChange(opt.value)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all",
                        currentAvailability?.toLowerCase() === opt.value.toLowerCase() 
                          ? cn("border-black bg-black text-white shadow-md") 
                          : "border-black/5 bg-gray-50 text-gray-400 hover:bg-white hover:border-black/20"
                      )}
                    >
                      <opt.icon className="size-4" />
                      <span className="text-[9px] font-black uppercase">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <DropdownMenuSeparator className="bg-black/5 mx-2" />
          <DropdownMenuGroup className="p-2">
            <DropdownMenuItem onClick={handleSettingsClick} className="flex items-center justify-between p-3 rounded-xl focus:bg-gray-50 focus:text-black cursor-pointer group transition-all">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                <span className="text-sm font-bold text-gray-600 group-hover:text-black">Profile Settings</span>
              </div>
              <ChevronRight className="size-3 text-gray-300" />
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center justify-between p-3 rounded-xl focus:bg-gray-50 focus:text-black cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                <span className="text-sm font-bold text-gray-600 group-hover:text-black">Help & Support</span>
              </div>
              <ChevronRight className="size-3 text-gray-300" />
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
