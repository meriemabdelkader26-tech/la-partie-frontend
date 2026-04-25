"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Bell, CreditCard, Lock, Eye, Mail, Trash2, ChevronRight, Laptop } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  return (
    <div className="space-y-10 pb-12 px-2">
      {/* Header */}
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
            Manage your security, notifications, and billing preferences.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {[
            { label: "Security & Login", icon: Shield, active: true },
            { label: "Notifications", icon: Bell, active: false },
            { label: "Billing & Plans", icon: CreditCard, active: false },
            { label: "Privacy", icon: Eye, active: false },
            { label: "Connected Apps", icon: Laptop, active: false }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                item.active ? 'bg-black text-white shadow-xl' : 'bg-white text-gray-500 hover:bg-gray-50 border border-black/5'
              }`}>
                <div className="flex items-center gap-4 font-black text-xs uppercase tracking-widest">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
                <ChevronRight className={`w-4 h-4 ${item.active ? 'opacity-100' : 'opacity-20'}`} />
              </button>
            </motion.div>
          ))}

          <div className="pt-8">
            <button className="w-full p-4 rounded-2xl border-2 border-rose-50 text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-4 font-black text-xs uppercase tracking-widest">
              <Trash2 className="w-5 h-5" />
              Deactivate Account
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white border-black/5 rounded-[3rem] shadow-large overflow-hidden">
              <CardHeader className="p-10 border-b border-black/5">
                <CardTitle className="text-2xl font-black text-black">Security & Login</CardTitle>
                <CardDescription className="font-medium text-gray-400">Manage your password and account security settings.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                {/* 2FA Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem]">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-black tracking-tight">Two-Factor Authentication</h4>
                      <p className="text-xs font-medium text-gray-500 max-w-xs">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-black" />
                </div>

                {/* Password Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem]">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-black tracking-tight">Account Password</h4>
                      <p className="text-xs font-medium text-gray-500 max-w-xs">Last changed 3 months ago.</p>
                    </div>
                  </div>
                  <Button variant="outline" className="h-11 px-6 border-2 border-black/5 font-black rounded-xl hover:bg-black hover:text-white transition-all">
                    Update
                  </Button>
                </div>

                {/* Login Alerts */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-[1.5rem]">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-black tracking-tight">Login Alerts</h4>
                      <p className="text-xs font-medium text-gray-500 max-w-xs">Get notified of unusual activity.</p>
                    </div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-black" />
                </div>

                {/* Email Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gray-50 text-gray-600 rounded-[1.5rem]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-black tracking-tight">Account Email</h4>
                      <p className="text-xs font-medium text-gray-500 max-w-xs">sarah@company-portal.com</p>
                    </div>
                  </div>
                  <Button variant="outline" className="h-11 px-6 border-2 border-black/5 font-black rounded-xl hover:bg-black hover:text-white transition-all">
                    Change
                  </Button>
                </div>
              </CardContent>
              <div className="p-10 bg-gray-50/50 border-t border-black/5 flex justify-end">
                <Button className="h-12 px-8 bg-black text-white font-black rounded-xl shadow-xl shadow-black/10">
                  Save Security Preferences
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
