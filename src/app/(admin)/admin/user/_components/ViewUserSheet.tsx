import { User } from "@/app/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Mail, Phone, Calendar, Shield, User as UserIcon } from "lucide-react";

interface Props {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewUserSheet({ user, open, onOpenChange }: Props) {
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white border-l border-gray-200 shadow-2xl sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="mb-6 space-y-3">
          <SheetTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-emerald-500" />
            User Details
          </SheetTitle>
          <SheetDescription className="text-gray-500 text-sm">
                  Detailed information about this user&apos;s account and status.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 mt-6">
          {/* Main Info Section */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-2xl shadow-sm border border-emerald-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user.role === "COMPANY" ? "secondary" : "default"} className="capitalize bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none text-xs">
                    {user.role.toLowerCase()}
                  </Badge>
                  {user.isVerifyByAdmin ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none shadow-none text-xs flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-none text-xs">
                      Pending Verification
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400">Email Address</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400">Phone Number</span>
                  <span className="text-sm font-medium">{user.phoneNumber || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Account Status</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400">Joined Date</span>
                  <span className="text-sm font-medium">
                    {format(new Date(user.createdAt), "MMMM dd, yyyy")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-gray-500 mb-1">Profile Setup</span>
                  <span className={`text-sm font-bold ${user.isCompletedProfile ? "text-emerald-600" : "text-amber-600"}`}>
                    {user.isCompletedProfile ? "Complete" : "Incomplete"}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-gray-500 mb-1">Email Verification</span>
                  <span className={`text-sm font-bold ${user.emailVerified ? "text-emerald-600" : "text-amber-600"}`}>
                    {user.emailVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}