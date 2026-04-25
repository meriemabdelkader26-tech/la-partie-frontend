"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { graphqlClient } from "@/lib/graphql-client";
import { CREATE_OFFER } from "@/lib/queries/offer-queries";
import {
  ArrowLeft,
  Save,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Target,
  Sparkles,
  Megaphone,
  Rocket,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  X,
  Plus,
  Layout,
  Globe,
  Briefcase,
  ChevronRight,
  Stars
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const NewOfferPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    minBudget: "",
    maxBudget: "",
    startDate: "",
    endDate: "",
    influencerNumber: "",
    requirement: "",
    objectif: "",
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.minBudget || parseFloat(formData.minBudget) <= 0) newErrors.minBudget = "Invalid budget";
    if (!formData.maxBudget || parseFloat(formData.maxBudget) <= 0) newErrors.maxBudget = "Invalid budget";
    if (formData.minBudget && formData.maxBudget && parseFloat(formData.minBudget) > parseFloat(formData.maxBudget)) {
      newErrors.maxBudget = "Max budget must be greater than min";
    }
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!formData.influencerNumber || parseInt(formData.influencerNumber) <= 0) newErrors.influencerNumber = "Required";
    if (!formData.requirement.trim()) newErrors.requirement = "Requirements are required";
    if (!formData.objectif.trim()) newErrors.objectif = "Objectives are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const variables = {
        title: formData.title,
        minBudget: parseFloat(formData.minBudget),
        maxBudget: parseFloat(formData.maxBudget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        influencerNumber: parseInt(formData.influencerNumber),
        requirement: formData.requirement,
        objectif: formData.objectif,
      };

      const data = await graphqlClient.request(CREATE_OFFER, variables);

      if (data.createOffer.success) {
        toast.success("Campaign launched successfully!");
        router.push("/company/campaigns");
      } else {
        toast.error(data.createOffer.message || "Failed to create campaign");
      }
    } catch (error: any) {
      console.error("Error creating offer:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRefineWithAI = async () => {
    if (!formData.requirement.trim() && !formData.objectif.trim() && !formData.title.trim()) {
      toast.error("Please provide some initial details for AI refinement");
      return;
    }

    try {
      setRefining(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const refinedRequirement = formData.requirement + "\n\n(AI Enhanced): We are looking for creators with high engagement in the lifestyle niche who value authenticity and high-quality visual storytelling.";
      
      setFormData(prev => ({ ...prev, requirement: refinedRequirement }));
      toast.success("Requirements refined with AI!");
    } catch (error) {
      toast.error("AI refinement failed");
    } finally {
      setRefining(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="pb-24 space-y-12">
      {/* Premium Hero Header */}
      <div className="relative px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-10"
        >
          <div className="space-y-4 max-w-3xl">
            <Link 
              href="/company/campaigns"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all group mb-4"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Campaigns
            </Link>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg -rotate-3">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-gray-100 text-gray-600 border border-gray-200 font-bold text-[10px] tracking-widest px-3 py-1.5 rounded-lg uppercase shadow-sm">
                  Step 1: Configuration
                </Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[0.9] font-sans">
                Launch <br />
                <span className="text-gray-400">Campaign</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                Define your brand's next major milestone. Connect with elite talent and scale your influence globally.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 min-w-[300px]">
          <Button 
            variant="outline"
            onClick={() => router.push("/company/campaigns")}
            className="h-14 px-8 border border-gray-200 hover:border-slate-900 hover:bg-gray-50 text-slate-700 hover:text-slate-900 font-semibold text-base rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm group/discard"
          >
            <span className="flex items-center gap-2">
              <X className="w-4 h-4 text-gray-400 group-hover/discard:text-slate-900 transition-colors" />
              Discard
            </span>
          </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="h-14 px-8 bg-slate-900 hover:bg-black text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer flex items-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              <span>{loading ? "Initializing..." : "Launch Mission"}</span>
              <Zap className="w-4 h-4 fill-white" />
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 max-w-7xl mx-auto">
        
        {/* Tactical Logistics Sidebar - Strategy First */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Strategy Insight - Moved to Top */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-8 bg-slate-900 border border-slate-800 rounded-4xl shadow-xl relative overflow-hidden group"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-700" />
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">Strategy Insight</h3>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Best Practices</span>
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Define clear milestones. Campaigns with <span className="text-white font-bold">specific KPIs</span> and detailed requirements attract significantly higher quality engagement from elite influencers.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest pt-4 border-t border-white/10">
                <Info className="w-3 h-3" />
                <span>AI Refinement available below</span>
              </div>
            </div>
          </motion.div>

          {/* Resource Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <Card className="bg-white border border-gray-200/60 rounded-4xl shadow-sm hover:shadow-md p-8 space-y-8 overflow-hidden transition-all duration-300">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gray-100 text-slate-900 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans">Economics</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Financial Boundaries</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Floor</Label>
                    <div className="relative group/field">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within/field:text-slate-900 transition-colors">$</span>
                      <Input
                        name="minBudget"
                        type="number"
                        value={formData.minBudget}
                        onChange={handleChange}
                        className="h-14 pl-8 bg-gray-50/50 border border-gray-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-bold rounded-xl text-lg transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ceiling</Label>
                    <div className="relative group/field">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within/field:text-slate-900 transition-colors">$</span>
                      <Input
                        name="maxBudget"
                        type="number"
                        value={formData.maxBudget}
                        onChange={handleChange}
                        className="h-14 pl-8 bg-gray-50/50 border border-gray-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-bold rounded-xl text-lg transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Target Talent Pool Size</Label>
                  <div className="relative group/field">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/field:text-slate-900 transition-colors" />
                    <Input
                      name="influencerNumber"
                      type="number"
                      value={formData.influencerNumber}
                      onChange={handleChange}
                      placeholder="e.g. 10"
                      className="h-14 pl-12 bg-gray-50/50 border border-gray-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-bold rounded-xl text-xl transition-all"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Deployment Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <Card className="bg-white border border-gray-200/60 rounded-4xl shadow-sm hover:shadow-md p-8 space-y-8 overflow-hidden transition-all duration-300">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gray-100 text-slate-900 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans">Deployment</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">Operational Windows</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Launch Date</Label>
                  <Input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="h-14 px-5 bg-gray-50/50 border border-gray-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-bold rounded-xl text-base transition-all cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Conclusion Date</Label>
                  <Input
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="h-14 px-5 bg-gray-50/50 border border-gray-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-bold rounded-xl text-base transition-all cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Strategic Data */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <Card className="bg-white border border-gray-200/60 rounded-4xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden">
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-slate-900">
                      <Layout className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 font-sans">Strategic Content</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Foundational campaign narrative</p>
                    </div>
                  </div>
                  <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] tracking-widest px-3 py-1.5 rounded-lg">REQUIRED</Badge>
                </div>

                <div className="space-y-8">
                  {/* Title Input */}
                  <div className="space-y-3 group/input">
                    <div className="flex items-center justify-between ml-1">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within/input:text-slate-900 transition-colors">
                        Mission Title
                      </Label>
                      {formData.title && <Check className="w-4 h-4 text-slate-900" />}
                    </div>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Minimalist Winter Collection 2026"
                      className={`h-16 bg-gray-50/50 border border-gray-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-bold rounded-2xl text-xl transition-all px-6 placeholder:text-gray-300 placeholder:font-medium ${errors.title ? "border-rose-500/50 ring-4 ring-rose-500/10 bg-rose-50/20" : ""}`}
                    />
                    {errors.title && (
                      <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-2">
                        {errors.title}
                      </motion.p>
                    )}
                  </div>

                  {/* Objective Input */}
                  <div className="space-y-3 group/input">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within/input:text-slate-900 transition-colors">
                      Strategic Objectives
                    </Label>
                    <Textarea
                      name="objectif"
                      value={formData.objectif}
                      onChange={handleChange}
                      rows={5}
                      placeholder="What is the definitive goal of this mission?"
                      className={`bg-gray-50/50 border border-gray-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-medium rounded-3xl text-lg transition-all resize-none p-6 leading-relaxed placeholder:text-gray-300 ${errors.objectif ? "border-rose-500/50 ring-4 ring-rose-500/10 bg-rose-50/20" : ""}`}
                    />
                    {errors.objectif && (
                      <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-2">
                        {errors.objectif}
                      </motion.p>
                    )}
                  </div>

                  {/* Requirements Input */}
                  <div className="space-y-3 group/input relative">
                    <div className="flex items-center justify-between ml-1">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within/input:text-slate-900 transition-colors">
                        Talent Requirements
                      </Label>
                      <Button 
                        type="button"
                        onClick={handleRefineWithAI}
                        disabled={refining}
                        variant="outline"
                        className="h-8 px-4 rounded-xl border border-gray-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-[10px] font-bold uppercase tracking-widest active:scale-95 flex items-center gap-2"
                      >
                        {refining ? (
                          <span className="flex items-center gap-2">Processing <Stars className="w-3 h-3 animate-spin" /></span>
                        ) : (
                          <>Optimize with AI <Sparkles className="w-3 h-3" /></>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      name="requirement"
                      value={formData.requirement}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Specify niche, engagement rates, and content quality standards..."
                      className={`bg-gray-50/50 border border-gray-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-medium rounded-3xl text-lg transition-all resize-none p-6 leading-relaxed placeholder:text-gray-300 ${errors.requirement ? "border-rose-500/50 ring-4 ring-rose-500/10 bg-rose-50/20" : ""}`}
                    />
                    {errors.requirement && (
                      <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-2">
                        {errors.requirement}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewOfferPage;
