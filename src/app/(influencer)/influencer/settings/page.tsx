"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Lock, Globe, Shield, Mail, Eye } from "lucide-react";
import { useState } from "react";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    emailCampaigns: true,
    emailMessages: true,
    emailPayments: true,
    pushCampaigns: false,
    pushMessages: true,
    pushPayments: true,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showStats: true,
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Jane Doe"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="jane.doe@example.com"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 234 567 8900"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Fashion & Lifestyle influencer passionate about sustainable living and authentic brand partnerships."
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Social Media Accounts
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Instagram
                  </label>
                  <input
                    type="text"
                    defaultValue="@janedoe"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    YouTube
                  </label>
                  <input
                    type="text"
                    defaultValue="JaneDoeVlogs"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Twitter
                  </label>
                  <input
                    type="text"
                    defaultValue="@janedoe"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Update Social Links
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Email Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Campaign Updates</p>
                      <p className="text-slate-400 text-sm">
                        Get notified about new campaigns
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailCampaigns}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        emailCampaigns: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Messages</p>
                      <p className="text-slate-400 text-sm">
                        Get notified about new messages
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailMessages}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        emailMessages: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Payments</p>
                      <p className="text-slate-400 text-sm">
                        Get notified about payments and earnings
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailPayments}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        emailPayments: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Push Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Campaign Updates</p>
                      <p className="text-slate-400 text-sm">
                        Real-time campaign notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushCampaigns}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        pushCampaigns: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Messages</p>
                      <p className="text-slate-400 text-sm">
                        Real-time message notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushMessages}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        pushMessages: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="space-y-4 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Privacy Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Public Profile</p>
                      <p className="text-slate-400 text-sm">
                        Make your profile visible to brands
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.profilePublic}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, profilePublic: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Show Email</p>
                      <p className="text-slate-400 text-sm">
                        Display email on public profile
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showEmail: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Show Statistics</p>
                      <p className="text-slate-400 text-sm">
                        Display your engagement stats
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.showStats}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showStats: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Update Password
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Delete Account
              </h3>
              <p className="text-slate-400 mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
