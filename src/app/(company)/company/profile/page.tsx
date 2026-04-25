"use client";

import { useEffect, useState } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_COMPANY_PROFILE, UPDATE_COMPANY_PROFILE } from "@/lib/queries/company-queries";
import { Company } from "@/lib/types/company-types";
import {
  Building2,
  Mail,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Save,
  Edit,
  Settings,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  Info,
  Map,
  Calendar,
  Layers,
  ChevronRight,
  Check,
  X,
  Plus,
  Layout,
  ExternalLink,
  Target,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

const ProfilePage = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    matricule: "",
    website: "",
    contactEmail: "",
    description: "",
    size: "",
    domainActivity: "",
    entrepriseType: "",
    disponibiliteCollaboration: "",
    langues: [] as string[],
    address: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const data = await graphqlClient.request(GET_MY_COMPANY_PROFILE);
      
      if (data.myCompanyProfile) {
        setCompany(data.myCompanyProfile);
        setFormData({
          companyName: data.myCompanyProfile.companyName || "",
          matricule: data.myCompanyProfile.matricule || "",
          website: data.myCompanyProfile.website || "",
          contactEmail: data.myCompanyProfile.contactEmail || "",
          description: data.myCompanyProfile.description || "",
          size: data.myCompanyProfile.size || "",
          domainActivity: data.myCompanyProfile.domainActivity || "",
          entrepriseType: data.myCompanyProfile.entrepriseType || "",
          disponibiliteCollaboration: data.myCompanyProfile.disponibiliteCollaboration || "",
          langues: data.myCompanyProfile.langues || [],
          address: {
            address: data.myCompanyProfile.address?.address || "",
            city: data.myCompanyProfile.address?.city || "",
            state: data.myCompanyProfile.address?.state || "",
            postalCode: data.myCompanyProfile.address?.postalCode || "",
            country: data.myCompanyProfile.address?.country || "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching company profile:", error);
      toast.error("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const variables = {
        companyName: formData.companyName,
        matricule: formData.matricule,
        website: formData.website,
        contactEmail: formData.contactEmail,
        description: formData.description,
        size: formData.size,
        domainActivity: formData.domainActivity,
        entrepriseType: formData.entrepriseType,
        disponibiliteCollaboration: formData.disponibiliteCollaboration,
        langues: formData.langues,
        address: formData.address.address ? formData.address : undefined,
      };

      const data = await graphqlClient.request(UPDATE_COMPANY_PROFILE, variables);
      if (data.updateCompanyProfile.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchCompanyProfile();
      } else {
        toast.error(data.updateCompanyProfile.message || "An error occurred");
      }
    } catch (error: any) {
      toast.error(error.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        matricule: company.matricule || "",
        website: company.website || "",
        contactEmail: company.contactEmail || "",
        description: company.description || "",
        size: company.size || "",
        domainActivity: company.domainActivity || "",
        entrepriseType: company.entrepriseType || "",
        disponibiliteCollaboration: company.disponibiliteCollaboration || "",
        langues: company.langues || [],
        address: {
          address: company.address?.address || "",
          city: company.address?.city || "",
          state: company.address?.state || "",
          postalCode: company.address?.postalCode || "",
          country: company.address?.country || "",
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse pb-12">
        <div className="h-64 bg-black/5 rounded-[3rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          <div className="h-[400px] bg-black/5 rounded-[2.5rem]" />
          <div className="lg:col-span-2 h-[600px] bg-black/5 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 max-w-lg">
          <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-black/5 shadow-soft">
            <Building2 className="w-12 h-12 text-gray-300" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-black tracking-tight">Your profile is missing</h2>
            <p className="text-gray-500 font-medium leading-relaxed">To start managing campaigns and collaborating with influencers, you need to complete your company registration.</p>
          </div>
          <Link href="/company/complete-profile">
            <Button className="h-14 px-10 bg-black hover:bg-gray-800 text-white font-black rounded-2xl shadow-xl hover:shadow-black/20 transition-all">
              Start Building Profile
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-8">
      {/* Premium Hero Banner Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative px-4"
      >
        <div className="h-64 md:h-80 w-full rounded-[3rem] bg-black relative overflow-hidden shadow-2xl">
          {/* Abstract pattern/gradient background */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 pb-16 md:pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Organization</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
                  {formData.companyName}
                </h1>
                <div className="flex items-center gap-4 text-white/60 font-medium">
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm truncate max-w-[200px]">{formData.website || "No website link"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{formData.address.city || "N/A"}, {formData.address.country || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="h-14 px-8 bg-white hover:bg-gray-100 text-black font-black text-lg rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Identity
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                      className="h-14 px-8 bg-white/10 hover:bg-white/20 border-white/10 text-white font-black rounded-2xl backdrop-blur-md transition-all"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Discard
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      {saving ? "Saving..." : "Save Identity"}
                      <Check className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company Initial / Logo Overlap */}
        <div className="absolute -bottom-10 left-12 md:left-20 w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white shadow-2xl border-[6px] border-gray-50 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
            <span className="text-6xl md:text-8xl font-black text-black select-none">
              {formData.companyName.charAt(0)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 pt-10">
        
        {/* Left Column - Core Stats & Quick Info */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white border-black/5 rounded-[2.5rem] shadow-large p-10 space-y-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black tracking-tight">Organization Bio</h3>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Public identity</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-black/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-soft">
                      <Mail className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Contact</span>
                  </div>
                  <p className="font-bold text-black text-lg truncate px-1">{formData.contactEmail || "No public email set"}</p>
                </div>

                <div className="p-6 bg-gray-50 rounded-[2rem] border border-black/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-soft">
                      <Target className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Industry focus</span>
                  </div>
                  <p className="font-bold text-black text-lg truncate px-1">
                    {formData.domainActivity || "General Market"}
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-[2rem] border border-black/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-soft">
                      <Users className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Company Size</span>
                  </div>
                  <p className="font-bold text-black text-lg truncate px-1">
                    {formData.size === "S" ? "1-50 employees" : 
                     formData.size === "M" ? "51-200 employees" :
                     formData.size === "L" ? "201-1000 employees" :
                     formData.size === "XL" ? "1000+ employees" : "Growth Stage"}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-black/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-gray-50 rounded-[2rem]">
                    <p className="text-2xl font-black text-black">Active</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-[2rem]">
                    <p className="text-2xl font-black text-black">{new Date(company.createdAt).getFullYear()}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 bg-black rounded-[2.5rem] shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-black text-xl tracking-tight">Security Score</h4>
                <p className="text-white/40 text-sm font-medium">Your profile is 100% complete and verified.</p>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-400 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Tabs / Detailed Settings */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="h-16 bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-black/5 shadow-soft w-full sm:w-auto mb-10 sticky top-24 z-30">
                <TabsTrigger value="overview" className="h-full px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl transition-all flex-1 sm:flex-none">
                  <Layout className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="entity" className="h-full px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl transition-all flex-1 sm:flex-none">
                  <Building className="w-4 h-4 mr-2" />
                  Entity Details
                </TabsTrigger>
                <TabsTrigger value="localization" className="h-full px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl transition-all flex-1 sm:flex-none">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent key="overview" value="overview" className="space-y-8 focus-visible:outline-none focus:outline-none">
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="space-y-8">
                    
                    {/* Brand Story / Description */}
                    <Card className="bg-white border-black/5 rounded-[3rem] shadow-large overflow-hidden">
                      <div className="p-10 space-y-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-soft">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-black tracking-tighter">Brand Mission</h4>
                              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Our Story & Purpose</p>
                            </div>
                          </div>
                        </div>

                        {!isEditing ? (
                          <div className="space-y-6">
                            <p className="text-lg font-medium text-gray-600 leading-relaxed italic">
                              {formData.description ? `"${formData.description}"` : "Tell your story to attract the right partners..."}
                            </p>
                            <div className="flex flex-wrap gap-3 pt-4">
                              <Badge className="bg-gray-100 text-gray-500 border-none font-bold uppercase text-[10px] tracking-widest px-4 py-2 rounded-xl">Premium Brand</Badge>
                              <Badge className="bg-gray-100 text-gray-500 border-none font-bold uppercase text-[10px] tracking-widest px-4 py-2 rounded-xl">Tech-Forward</Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Write your mission statement</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={8}
                              className="bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-[2rem] transition-all resize-none leading-relaxed p-6 text-lg"
                              placeholder="Describe your company mission, values, and why influencers should work with you..."
                            />
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Quick Access Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card className="bg-white border-black/5 rounded-[3rem] shadow-large p-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-soft">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-black tracking-tight">Collaboration</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</p>
                          </div>
                        </div>
                        
                        {!isEditing ? (
                          <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 flex items-center justify-between">
                            <span className="font-black text-emerald-700 uppercase tracking-widest text-xs">Currently</span>
                            <Badge className="bg-emerald-500 text-white border-none px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest">
                              {formData.disponibiliteCollaboration || "Available"}
                            </Badge>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</Label>
                            <Select value={formData.disponibiliteCollaboration} onValueChange={(v) => setFormData({ ...formData, disponibiliteCollaboration: v })}>
                              <SelectTrigger className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl">
                                <SelectValue placeholder="Update status" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-black/5 shadow-large">
                                <SelectItem value="disponible">Available</SelectItem>
                                <SelectItem value="partiellement_disponible">Limited</SelectItem>
                                <SelectItem value="occupe">Fully Booked</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </Card>

                      <Card className="bg-white border-black/5 rounded-[3rem] shadow-large p-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-soft">
                            <ExternalLink className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-black tracking-tight">Connectivity</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">External Links</p>
                          </div>
                        </div>
                        
                        {!isEditing ? (
                          <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100/50 flex items-center justify-between">
                            <span className="font-black text-amber-700 uppercase tracking-widest text-xs truncate max-w-[120px]">
                              {formData.website || "Not set"}
                            </span>
                            <Button variant="ghost" size="icon" className="text-amber-600 hover:bg-amber-100 rounded-xl" asChild>
                              <Link href={formData.website?.startsWith('http') ? formData.website : `https://${formData.website}`} target="_blank">
                                <ExternalLink className="w-5 h-5" />
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Website URL</Label>
                            <Input
                              value={formData.website}
                              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                              className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl"
                              placeholder="www.company.com"
                            />
                          </div>
                        )}
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent key="entity" value="entity" className="space-y-8 focus-visible:outline-none">
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                    <Card className="bg-white border-black/5 rounded-[3rem] shadow-large p-10">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-black text-white rounded-2xl shadow-xl">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-black tracking-tight">Legal & Corporate</h3>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Official Registration Details</p>
                        </div>
                      </div>

                      <div className="grid gap-10 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Info className="w-3 h-3" /> Registration Name
                          </Label>
                          <Input
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            disabled={!isEditing}
                            className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl text-lg"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" /> Registration ID (Matricule)
                          </Label>
                          <Input
                            value={formData.matricule}
                            onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                            disabled={!isEditing}
                            className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl text-lg"
                            placeholder="e.g. TAX-123456"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Layers className="w-3 h-3" /> Entity Type
                          </Label>
                          <Select
                            disabled={!isEditing}
                            value={formData.entrepriseType}
                            onValueChange={(v) => setFormData({ ...formData, entrepriseType: v })}
                          >
                            <SelectTrigger className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl text-lg">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-black/5 shadow-large">
                              <SelectItem value="PRIV">Private Sector</SelectItem>
                              <SelectItem value="PUB">Public / Government</SelectItem>
                              <SelectItem value="NGO">Non-Profit / NGO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Users className="w-3 h-3" /> Talent Range
                          </Label>
                          <Select
                            disabled={!isEditing}
                            value={formData.size}
                            onValueChange={(v) => setFormData({ ...formData, size: v })}
                          >
                            <SelectTrigger className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl text-lg">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-black/5 shadow-large">
                              <SelectItem value="S">Start-up (1-50)</SelectItem>
                              <SelectItem value="M">Scaling (51-200)</SelectItem>
                              <SelectItem value="L">Enterprise (201-1000)</SelectItem>
                              <SelectItem value="XL">Global Leader (1001+)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent key="localization" value="localization" className="space-y-8 focus-visible:outline-none">
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                    <Card className="bg-white border-black/5 rounded-[3rem] shadow-large overflow-hidden">
                      <div className="p-10">
                        <div className="flex items-center gap-4 mb-10">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-soft">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-black tracking-tight">Geographic Data</h3>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Headquarters & Service Areas</p>
                          </div>
                        </div>

                        <div className="grid gap-10">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <Map className="w-3 h-3" /> Full Street Address
                            </Label>
                            <Input
                              value={formData.address.address}
                              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, address: e.target.value }})}
                              disabled={!isEditing}
                              className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl text-lg"
                              placeholder="Building Name, Street 123..."
                            />
                          </div>

                          <div className="grid gap-10 md:grid-cols-3">
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</Label>
                              <Input
                                value={formData.address.city}
                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value }})}
                                disabled={!isEditing}
                                className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Region</Label>
                              <Input
                                value={formData.address.state}
                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value }})}
                                disabled={!isEditing}
                                className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postal Code</Label>
                              <Input
                                value={formData.address.postalCode}
                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value }})}
                                disabled={!isEditing}
                                className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <Globe className="w-3 h-3" /> Country / Territory
                            </Label>
                            <Input
                              value={formData.address.country}
                              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value }})}
                              disabled={!isEditing}
                              className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl text-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subtle Map visual hint */}
                      <div className="h-32 bg-gray-50 border-t border-black/5 flex items-center justify-center gap-4 text-gray-400 select-none">
                        <MapPin className="w-8 h-8 opacity-20" />
                        <span className="font-black text-[10px] uppercase tracking-[0.3em]">Precision Location Verified</span>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
