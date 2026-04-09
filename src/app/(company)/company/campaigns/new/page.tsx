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
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const NewOfferPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.minBudget || parseFloat(formData.minBudget) <= 0) {
      newErrors.minBudget = "Le budget minimum doit être supérieur à 0";
    }

    if (!formData.maxBudget || parseFloat(formData.maxBudget) <= 0) {
      newErrors.maxBudget = "Le budget maximum doit être supérieur à 0";
    }

    if (
      formData.minBudget &&
      formData.maxBudget &&
      parseFloat(formData.minBudget) > parseFloat(formData.maxBudget)
    ) {
      newErrors.maxBudget = "Le budget max doit être supérieur au budget min";
    }

    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La date de fin est requise";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate = "La date de fin doit être après la date de début";
      }
    }

    if (!formData.influencerNumber || parseInt(formData.influencerNumber) <= 0) {
      newErrors.influencerNumber = "Le nombre d'influenceurs doit être supérieur à 0";
    }

    if (!formData.requirement.trim()) {
      newErrors.requirement = "Les exigences sont requises";
    }

    if (!formData.objectif.trim()) {
      newErrors.objectif = "L'objectif est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
        alert("Offre créée avec succès !");
        router.push("/company/campaigns");
      } else {
        alert(data.createOffer.message || "Erreur lors de la création");
      }
    } catch (error: any) {
      console.error("Error creating offer:", error);
      alert(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/company/campaigns">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Nouvelle Offre de Collaboration 📢
          </h1>
          <p className="text-slate-400 mt-1">
            Créez une offre pour recruter des influenceurs
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Informations de base
            </CardTitle>
            <CardDescription className="text-slate-400">
              Titre et objectifs de votre offre
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">
                Titre de l&apos;offre *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Recherche influenceur tech pour campagne produit"
                className={`bg-slate-800 border-slate-700 text-white ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectif" className="text-slate-300">
                Objectif de la collaboration *
              </Label>
              <Textarea
                id="objectif"
                name="objectif"
                value={formData.objectif}
                onChange={handleChange}
                placeholder="Décrivez l'objectif principal de cette collaboration..."
                rows={4}
                className={`bg-slate-800 border-slate-700 text-white resize-none ${
                  errors.objectif ? "border-red-500" : ""
                }`}
              />
              {errors.objectif && (
                <p className="text-red-400 text-sm">{errors.objectif}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirement" className="text-slate-300">
                Exigences et critères *
              </Label>
              <Textarea
                id="requirement"
                name="requirement"
                value={formData.requirement}
                onChange={handleChange}
                placeholder="Ex: Minimum 10k abonnés, thématique tech, taux d'engagement > 3%..."
                rows={5}
                className={`bg-slate-800 border-slate-700 text-white resize-none ${
                  errors.requirement ? "border-red-500" : ""
                }`}
              />
              {errors.requirement && (
                <p className="text-red-400 text-sm">{errors.requirement}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Budget
            </CardTitle>
            <CardDescription className="text-slate-400">
              Définissez votre fourchette budgétaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minBudget" className="text-slate-300">
                  Budget minimum ($) *
                </Label>
                <Input
                  id="minBudget"
                  name="minBudget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minBudget}
                  onChange={handleChange}
                  placeholder="Ex: 500"
                  className={`bg-slate-800 border-slate-700 text-white ${
                    errors.minBudget ? "border-red-500" : ""
                  }`}
                />
                {errors.minBudget && (
                  <p className="text-red-400 text-sm">{errors.minBudget}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBudget" className="text-slate-300">
                  Budget maximum ($) *
                </Label>
                <Input
                  id="maxBudget"
                  name="maxBudget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  placeholder="Ex: 2000"
                  className={`bg-slate-800 border-slate-700 text-white ${
                    errors.maxBudget ? "border-red-500" : ""
                  }`}
                />
                {errors.maxBudget && (
                  <p className="text-red-400 text-sm">{errors.maxBudget}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Période de collaboration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Dates de début et de fin de la collaboration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-300">
                  Date de début *
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`bg-slate-800 border-slate-700 text-white ${
                    errors.startDate ? "border-red-500" : ""
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-400 text-sm">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-300">
                  Date de fin *
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`bg-slate-800 border-slate-700 text-white ${
                    errors.endDate ? "border-red-500" : ""
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-400 text-sm">{errors.endDate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Influencers */}
        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Influenceurs recherchés
            </CardTitle>
            <CardDescription className="text-slate-400">
              Combien d&apos;influenceurs souhaitez-vous recruter ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="influencerNumber" className="text-slate-300">
                Nombre d&apos;influenceurs *
              </Label>
              <Input
                id="influencerNumber"
                name="influencerNumber"
                type="number"
                min="1"
                value={formData.influencerNumber}
                onChange={handleChange}
                placeholder="Ex: 3"
                className={`bg-slate-800 border-slate-700 text-white ${
                  errors.influencerNumber ? "border-red-500" : ""
                }`}
              />
              {errors.influencerNumber && (
                <p className="text-red-400 text-sm">{errors.influencerNumber}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Link href="/company/campaigns">
            <Button
              type="button"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Annuler
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {loading ? (
              <>Création en cours...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Créer l&apos;offre
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewOfferPage;
