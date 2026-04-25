"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Lock, Globe, Shield, Mail, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_INFLUENCER_SETTINGS, UPDATE_USER } from "./query";
import Loading from "@/app/loading";
import { toast } from "sonner";
import { useSessionStore } from "@/stores/use-session-store";

const tabVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } },
};

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { currentUser, setCurrentUser } = useSessionStore();
  const [activeTab, setActiveTab] = useState("account");

  // Account Settings State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [biography, setBiography] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");

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

  const { data, isFetching } = useQuery({
    queryKey: ["influencerSettings"],
    queryFn: async () => {
      return await graphqlClient.request(GET_INFLUENCER_SETTINGS);
    },
  });

  useEffect(() => {
    if (data?.myInfluencerProfile) {
      setCurrentUser({
        ...currentUser,
        name: data.myInfluencerProfile?.user?.name || currentUser?.name,
        email: data.myInfluencerProfile?.user?.email || currentUser?.email,
        profilePicture: data.myInfluencerProfile?.images?.find((i: any) => i.isDefault)?.url || data.myInfluencerProfile?.images?.[0]?.url || currentUser?.profilePicture,
      } as any);
      
      const profile = data.myInfluencerProfile;
      setName(profile.user?.name || "");
      setEmail(profile.user?.email || "");
      setPhoneNumber(profile.user?.phoneNumber || "");
      setBiography(profile.biography || "");
      setInstagramUsername(profile.instagramUsername || "");
      
      const yt = profile.reseauxSociaux?.find((r: any) => r.plateforme === "YOUTUBE");
      if (yt) setYoutube(yt.urlProfil);

      const tw = profile.reseauxSociaux?.find((r: any) => r.plateforme === "TWITTER");
      if (tw) setTwitter(tw.urlProfil);
    }
  }, [data]);

  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: async () => {
      const userId = data?.myInfluencerProfile?.user?.id;
      if (!userId) throw new Error("User ID not found");
      return await graphqlClient.request(UPDATE_USER, {
        userId,
        name,
        phoneNumber,
      });
    },
    onSuccess: () => {
      toast.success("Account settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["influencerSettings"] });
    },
    onError: () => {
      toast.error("Failed to update account settings");
    },
  });

  const handleSaveAccount = () => {
    updateUser();
  };

  if (isFetching && !data) return <Loading />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 max-w-4xl mx-auto py-8"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-black tracking-tight">Settings</h1>
        <p className="text-gray-500 font-medium mt-2 text-lg">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100/80 backdrop-blur-sm border border-black/5 rounded-2xl p-1.5 h-auto grid grid-cols-4 gap-1">
          {[
            { id: "account", label: "Account", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "privacy", label: "Privacy", icon: Shield },
            { id: "security", label: "Security", icon: Lock },
          ].map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md rounded-xl transition-all duration-300 flex items-center justify-center font-semibold text-sm"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-8 relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "account" && (
              <motion.div key="account" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-xl border-2 border-black/5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-black/5 rounded-xl">
                          <User className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-2xl font-bold text-black">
                          Account Information
                        </h3>
                      </div>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-bold text-gray-700 ml-1">
                              Full Name
                            </label>
                            <input
                              id="fullName"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-5 py-4 bg-gray-50 border-2 border-black/5 rounded-2xl text-black focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="emailAddress" className="text-sm font-bold text-gray-700 ml-1">
                              Email Address
                            </label>
                            <input
                              id="emailAddress"
                              type="email"
                              value={email}
                              disabled
                              className="w-full px-5 py-4 bg-gray-100 border-2 border-black/5 rounded-2xl text-gray-500 cursor-not-allowed transition-all duration-300"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="phoneNumber" className="text-sm font-bold text-gray-700 ml-1">
                            Phone Number
                          </label>
                          <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-black/5 rounded-2xl text-black focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="bio" className="text-sm font-bold text-gray-700 ml-1">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            rows={4}
                            value={biography}
                            onChange={(e) => setBiography(e.target.value)}
                            disabled
                            className="w-full px-5 py-4 bg-gray-100 border-2 border-black/5 rounded-2xl text-gray-600 focus:outline-none transition-all duration-300 resize-none cursor-not-allowed"
                          />
                        </div>
                        <Button 
                          onClick={handleSaveAccount}
                          disabled={isUpdatingUser}
                          className="w-full md:w-auto bg-black hover:bg-gray-800 text-white rounded-2xl px-10 py-6 font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        >
                          {isUpdatingUser ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-xl border-2 border-black/5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-black/5 rounded-xl">
                          <Globe className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-2xl font-bold text-black">
                          Social Media Accounts
                        </h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="instagram" className="text-sm font-bold text-gray-700 ml-1">
                            Instagram
                          </label>
                          <input
                            id="instagram"
                            type="text"
                            value={instagramUsername}
                            disabled
                            className="w-full px-5 py-4 bg-gray-100 border-2 border-black/5 rounded-2xl text-gray-500 cursor-not-allowed transition-all duration-300"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="youtube" className="text-sm font-bold text-gray-700 ml-1">
                              YouTube
                            </label>
                            <input
                              id="youtube"
                              type="text"
                              value={youtube}
                              onChange={(e) => setYoutube(e.target.value)}
                              disabled
                              className="w-full px-5 py-4 bg-gray-100 border-2 border-black/5 rounded-2xl text-gray-500 cursor-not-allowed transition-all duration-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="twitter" className="text-sm font-bold text-gray-700 ml-1">
                              Twitter
                            </label>
                            <input
                              id="twitter"
                              type="text"
                              value={twitter}
                              onChange={(e) => setTwitter(e.target.value)}
                              disabled
                              className="w-full px-5 py-4 bg-gray-100 border-2 border-black/5 rounded-2xl text-gray-500 cursor-not-allowed transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div key="notifications" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-xl border-2 border-black/5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-black/5 rounded-xl">
                          <Mail className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-2xl font-bold text-black">
                          Email Notifications
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { id: 'emailCampaigns', label: 'Campaign Updates', desc: 'Get notified about new campaigns' },
                          { id: 'emailMessages', label: 'Messages', desc: 'Get notified about new messages' },
                          { id: 'emailPayments', label: 'Payments', desc: 'Get notified about payments and earnings' }
                        ].map((item, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={item.id} 
                            className="flex items-center justify-between p-6 bg-gray-50/50 border-2 border-black/5 rounded-2xl hover:border-black/10 transition-colors duration-300"
                          >
                            <div>
                              <p className="text-black font-bold text-lg">{item.label}</p>
                              <p className="text-gray-500 text-sm font-medium mt-1">
                                {item.desc}
                              </p>
                            </div>
                            <Switch
                              checked={(notifications as any)[item.id]}
                              onCheckedChange={(checked) =>
                                setNotifications({
                                  ...notifications,
                                  [item.id]: checked,
                                })
                              }
                              className="scale-110"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-xl border-2 border-black/5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-black/5 rounded-xl">
                          <Bell className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-2xl font-bold text-black">
                          Push Notifications
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { id: 'pushCampaigns', label: 'Campaign Updates', desc: 'Real-time campaign notifications' },
                          { id: 'pushMessages', label: 'Messages', desc: 'Real-time message notifications' }
                        ].map((item, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={item.id} 
                            className="flex items-center justify-between p-6 bg-gray-50/50 border-2 border-black/5 rounded-2xl hover:border-black/10 transition-colors duration-300"
                          >
                            <div>
                              <p className="text-black font-bold text-lg">{item.label}</p>
                              <p className="text-gray-500 text-sm font-medium mt-1">
                                {item.desc}
                              </p>
                            </div>
                            <Switch
                              checked={(notifications as any)[item.id]}
                              onCheckedChange={(checked) =>
                                setNotifications({
                                  ...notifications,
                                  [item.id]: checked,
                                })
                              }
                              className="scale-110"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div key="privacy" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                <Card className="bg-white/80 backdrop-blur-xl border-2 border-black/5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="p-3 bg-black/5 rounded-xl">
                        <Shield className="w-6 h-6 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold text-black">
                        Privacy Settings
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { id: 'profilePublic', label: 'Public Profile', desc: 'Make your profile visible to brands', icon: Globe },
                        { id: 'showEmail', label: 'Show Email', desc: 'Display email on public profile', icon: Eye },
                        { id: 'showStats', label: 'Show Statistics', desc: 'Display your engagement stats', icon: Eye }
                      ].map((item, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={item.id} 
                          className="flex items-center justify-between p-6 bg-gray-50/50 border-2 border-black/5 rounded-2xl hover:border-black/10 transition-colors duration-300"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border-2 border-black/5 shadow-sm">
                              <item.icon className="w-6 h-6 text-black" />
                            </div>
                            <div>
                              <p className="text-black font-bold text-lg">{item.label}</p>
                              <p className="text-gray-500 text-sm font-medium mt-1">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={(privacy as any)[item.id]}
                            onCheckedChange={(checked) =>
                              setPrivacy({ ...privacy, [item.id]: checked })
                            }
                            className="scale-110"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div key="security" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-xl border-2 border-black/5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-black/5 rounded-xl">
                          <Lock className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-2xl font-bold text-black">
                          Change Password
                        </h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="currentPassword" className="text-sm font-bold text-gray-700 ml-1">
                            Current Password
                          </label>
                          <input
                            id="currentPassword"
                            type="password"
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-black/5 rounded-2xl text-black focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="newPassword" className="text-sm font-bold text-gray-700 ml-1">
                            New Password
                          </label>
                          <input
                            id="newPassword"
                            type="password"
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-black/5 rounded-2xl text-black focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700 ml-1">
                            Confirm New Password
                          </label>
                          <input
                            id="confirmPassword"
                            type="password"
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-black/5 rounded-2xl text-black focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                          />
                        </div>
                        <Button className="w-full md:w-auto bg-black hover:bg-gray-800 text-white rounded-2xl px-10 py-6 font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-red-50/50 backdrop-blur-xl border-2 border-red-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-red-600 mb-4">
                        Delete Account
                      </h3>
                      <p className="text-red-900/60 font-medium mb-8 text-lg">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" className="rounded-2xl px-10 py-6 font-bold hover:scale-[1.02] transition-transform duration-300 shadow-md">
                        Delete Account
                      </Button>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
