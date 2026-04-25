"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Info, DollarSign, Calendar, Users, FileText, Target, Rocket, ArrowRight, X, Edit } from "lucide-react";
import { graphqlClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface OfferFormData {
  title: string;
  objectif: string;
  requirement: string;
  minBudget: string;
  maxBudget: string;
  startDate: string;
  endDate: string;
  influencerNumber: string;
}

interface FormErrors {
  [key: string]: string;
}

const GET_OFFER = gql`
  query GetOffer($id: ID!) {
    offer(id: $id) {
      id
      title
      objectif
      requirement
      minBudget
      maxBudget
      startDate
      endDate
      influencerNumber
    }
  }
`;

const UPDATE_OFFER = gql`
  mutation UpdateOffer(
    $id: ID!
    $title: String
    $minBudget: Float
    $maxBudget: Float
    $startDate: Date
    $endDate: Date
    $influencerNumber: Int
    $requirement: String
    $objectif: String
  ) {
    updateOffer(
      id: $id
      title: $title
      minBudget: $minBudget
      maxBudget: $maxBudget
      startDate: $startDate
      endDate: $endDate
      influencerNumber: $influencerNumber
      requirement: $requirement
      objectif: $objectif
    ) {
      success
      message
      offer {
        id
        title
        objectif
        requirement
        minBudget
        maxBudget
        startDate
        endDate
        influencerNumber
      }
    }
  }
`;

export default function EditOfferPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = decodeURIComponent(params.id as string);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OfferFormData>({
    title: "",
    objectif: "",
    requirement: "",
    minBudget: "",
    maxBudget: "",
    startDate: "",
    endDate: "",
    influencerNumber: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      setError(null);

      const data: any = await graphqlClient.request(
        GET_OFFER,
        { id: offerId }
      );

      const offer = data.offer;
      setFormData({
        title: offer.title,
        objectif: offer.objectif,
        requirement: offer.requirement,
        minBudget: offer.minBudget.toString(),
        maxBudget: offer.maxBudget.toString(),
        startDate: offer.startDate,
        endDate: offer.endDate,
        influencerNumber: offer.influencerNumber.toString(),
      });
    } catch (err: any) {
      console.error("Error loading offer:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.objectif.trim()) newErrors.objectif = "Objectives are required";
    if (!formData.requirement.trim()) newErrors.requirement = "Requirements are required";
    if (!formData.minBudget) newErrors.minBudget = "Required";
    if (!formData.maxBudget) newErrors.maxBudget = "Required";
    if (parseFloat(formData.maxBudget) < parseFloat(formData.minBudget)) newErrors.maxBudget = "Must be higher than min";
    if (!formData.startDate) newErrors.startDate = "Required";
    if (!formData.endDate) newErrors.endDate = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const variables = {
        id: offerId,
        title: formData.title.trim(),
        objectif: formData.objectif.trim(),
        requirement: formData.requirement.trim(),
        minBudget: parseFloat(formData.minBudget),
        maxBudget: parseFloat(formData.maxBudget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        influencerNumber: parseInt(formData.influencerNumber),
      };

      const data: any = await graphqlClient.request(
        UPDATE_OFFER,
        variables
      );

      if (data.updateOffer.success) {
        toast.success("Campaign updated successfully!");
        router.push(`/company/campaigns/${offerId}`);
      } else {
        toast.error(data.updateOffer.message || "Failed to update campaign");
      }
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update campaign");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-20 w-3/4 bg-black/5 rounded-4xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-black/5 rounded-[2.5rem]" />
          <div className="h-[400px] bg-black/5 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 px-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            onClick={() => router.push(`/company/campaigns/${offerId}`)}
            className="group flex items-center gap-2 text-gray-400 hover:text-black font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Details
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            <Edit className="w-3 h-3 text-blue-400" />
            <span>Editor Mode</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">
            Edit <span className="text-gray-400">Campaign</span> ✏️
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Refine your offer details to attract the best talent.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            onClick={() => router.push(`/company/campaigns/${offerId}`)}
            className="h-14 px-8 border-2 border-black/5 hover:border-rose-500/20 hover:bg-rose-50/30 text-black font-black rounded-2xl transition-all group/discard active:scale-95"
          >
            <span className="flex items-center gap-2">
              <X className="w-4 h-4 text-gray-400 group-hover/discard:text-rose-500 transition-colors" />
              Discard Changes
            </span>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-14 px-8 bg-black hover:bg-gray-800 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-black/20 transition-all"
          >
            {submitting ? "Saving..." : "Save Changes"}
            <Save className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white border-black/5 rounded-[2.5rem] shadow-large p-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-black text-white rounded-2xl">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-black tracking-tight">Campaign Info</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Core details</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Title</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} className="h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl" />
                  {errors.title && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest ml-1">{errors.title}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Objectives</Label>
                  <Textarea name="objectif" value={formData.objectif} onChange={handleChange} rows={4} className="bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl resize-none" />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Requirements</Label>
                  <Textarea name="requirement" value={formData.requirement} onChange={handleChange} rows={6} className="bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl resize-none" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white border-black/5 rounded-[2.5rem] shadow-large p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-black tracking-tight">Budget & Scale</h3>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min ($)</Label>
                    <Input name="minBudget" type="number" value={formData.minBudget} onChange={handleChange} className="h-12 bg-gray-50 font-bold rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max ($)</Label>
                    <Input name="maxBudget" type="number" value={formData.maxBudget} onChange={handleChange} className="h-12 bg-gray-50 font-bold rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Influencers Needed</Label>
                  <Input name="influencerNumber" type="number" value={formData.influencerNumber} onChange={handleChange} className="h-12 bg-gray-50 font-bold rounded-xl" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white border-black/5 rounded-[2.5rem] shadow-large p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-black tracking-tight">Timeline</h3>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</Label>
                  <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="h-12 bg-gray-50 font-bold rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date</Label>
                  <Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="h-12 bg-gray-50 font-bold rounded-xl" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
