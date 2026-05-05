"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Shield, 
  Lock, 
  Mail, 
  Loader2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_COMPANY_PROFILE } from "@/lib/queries/company-queries";
import { CHANGE_PASSWORD, DELETE_ACCOUNT, UPDATE_EMAIL } from "@/lib/queries/auth-queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [emailForm, setEmailForm] = useState({ email: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["myCompanyProfile"],
    queryFn: () => graphqlClient.request<any>(GET_MY_COMPANY_PROFILE),
  });

  const user = profileData?.myCompanyProfile?.user;

  useEffect(() => {
    if (user?.email) {
      setEmailForm({ email: user.email });
    }
  }, [user]);

  const updateEmailMutation = useMutation({
    mutationFn: (variables: { userId: string; email: string }) =>
      graphqlClient.request(UPDATE_EMAIL, variables),
    onSuccess: () => {
      toast.success("Email updated successfully");
      queryClient.invalidateQueries({ queryKey: ["myCompanyProfile"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update email");
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (variables: any) =>
      graphqlClient.request(CHANGE_PASSWORD, variables),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to change password");
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (variables: { userId: string }) =>
      graphqlClient.request(DELETE_ACCOUNT, variables),
    onSuccess: () => {
      toast.success("Account deactivated successfully");
      localStorage.clear();
      router.push("/login");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to deactivate account");
    }
  });

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    updateEmailMutation.mutate({ userId: user.id, email: emailForm.email });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    changePasswordMutation.mutate({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to deactivate your account? This action is permanent and cannot be undone.")) {
      if (user?.id) {
        deleteAccountMutation.mutate({ userId: user.id });
      }
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 px-2 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            <Settings className="w-3 h-3 text-amber-400" />
            <span>Account Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">
            System <span className="text-gray-400">Settings</span> ⚙️
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Manage your account security and preferences.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-black/5 rounded-[3rem] shadow-large overflow-hidden">
            <CardHeader className="p-10 border-b border-black/5 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-2xl shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-black">Security & Access</CardTitle>
                  <CardDescription className="font-medium text-gray-400">Secure your account by managing your credentials.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-black uppercase tracking-tight">Email Address</h3>
                </div>
                <form onSubmit={handleUpdateEmail} className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Email</label>
                    <Input 
                      type="email" 
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ email: e.target.value })}
                      className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-xl transition-all"
                      placeholder="Enter new email"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={updateEmailMutation.isPending || emailForm.email === user?.email}
                    className="w-fit h-11 px-8 bg-black text-white font-black rounded-xl shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {updateEmailMutation.isPending ? "Updating..." : "Update Email"}
                  </Button>
                </form>
              </div>

              <div className="h-px bg-black/5 w-full" />

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-black uppercase tracking-tight">Change Password</h3>
                </div>
                <form onSubmit={handleChangePassword} className="grid gap-6 max-w-md">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                      <Input 
                        type="password" 
                        required
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-xl transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <Input 
                        type="password" 
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-xl transition-all"
                        placeholder="Minimum 8 characters"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <Input 
                        type="password" 
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-xl transition-all"
                        placeholder="Re-type new password"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={changePasswordMutation.isPending}
                    className="w-fit h-11 px-8 bg-black text-white font-black rounded-xl shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all"
                  >
                    {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </div>

              <div className="h-px bg-black/5 w-full" />

              <div className="pt-4">
                <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center md:text-left">
                    <h4 className="text-lg font-black text-rose-600 uppercase tracking-tight">Deactivate Account</h4>
                    <p className="text-sm font-medium text-rose-500/60 max-w-md">
                      Permanently remove your account and all associated data. This action is irreversible.
                    </p>
                  </div>
                  <Button 
                    onClick={handleDeleteAccount}
                    variant="ghost" 
                    disabled={deleteAccountMutation.isPending}
                    className="h-12 px-8 bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white font-black rounded-xl shadow-sm transition-all whitespace-nowrap"
                  >
                    {deleteAccountMutation.isPending ? "Deactivating..." : "Deactivate Account"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
