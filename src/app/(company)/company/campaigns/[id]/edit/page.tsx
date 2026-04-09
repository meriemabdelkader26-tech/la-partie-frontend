"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react";
import { request, gql } from "graphql-request";

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
  mutation UpdateOffer($offerId: ID!, $input: UpdateOfferInput!) {
    updateOffer(offerId: $offerId, input: $input) {
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
  const offerId = params.id as string;

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

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const data: any = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
        GET_OFFER,
        { id: offerId },
        { Authorization: `JWT ${token}` }
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
      console.error("Erreur lors du chargement de l'offre:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation du titre
    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (formData.title.length < 5) {
      newErrors.title = "Le titre doit contenir au moins 5 caractères";
    }

    // Validation de l'objectif
    if (!formData.objectif.trim()) {
      newErrors.objectif = "L'objectif est requis";
    } else if (formData.objectif.length < 20) {
      newErrors.objectif = "L'objectif doit contenir au moins 20 caractères";
    }

    // Validation des exigences
    if (!formData.requirement.trim()) {
      newErrors.requirement = "Les exigences sont requises";
    } else if (formData.requirement.length < 20) {
      newErrors.requirement = "Les exigences doivent contenir au moins 20 caractères";
    }

    // Validation du budget
    const minBudget = parseFloat(formData.minBudget);
    const maxBudget = parseFloat(formData.maxBudget);

    if (!formData.minBudget || isNaN(minBudget)) {
      newErrors.minBudget = "Le budget minimum est requis";
    } else if (minBudget < 0) {
      newErrors.minBudget = "Le budget minimum doit être positif";
    }

    if (!formData.maxBudget || isNaN(maxBudget)) {
      newErrors.maxBudget = "Le budget maximum est requis";
    } else if (maxBudget < 0) {
      newErrors.maxBudget = "Le budget maximum doit être positif";
    } else if (maxBudget < minBudget) {
      newErrors.maxBudget = "Le budget maximum doit être supérieur au minimum";
    }

    // Validation des dates
    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La date de fin est requise";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end <= start) {
        newErrors.endDate = "La date de fin doit être après la date de début";
      }
    }

    // Validation du nombre d'influenceurs
    const influencerNumber = parseInt(formData.influencerNumber);
    if (!formData.influencerNumber || isNaN(influencerNumber)) {
      newErrors.influencerNumber = "Le nombre d'influenceurs est requis";
    } else if (influencerNumber < 1) {
      newErrors.influencerNumber = "Au moins 1 influenceur est requis";
    } else if (influencerNumber > 100) {
      newErrors.influencerNumber = "Maximum 100 influenceurs";
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
      setSubmitting(true);

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const input = {
        title: formData.title.trim(),
        objectif: formData.objectif.trim(),
        requirement: formData.requirement.trim(),
        minBudget: parseFloat(formData.minBudget),
        maxBudget: parseFloat(formData.maxBudget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        influencerNumber: parseInt(formData.influencerNumber),
      };

      await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
        UPDATE_OFFER,
        { offerId, input },
        { Authorization: `JWT ${token}` }
      );

      router.push(`/company/campaigns/${offerId}`);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour:", err);
      alert(err.message || "Erreur lors de la mise à jour de l'offre");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Button onClick={() => router.push("/company/campaigns")}>
          Retour aux offres
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/company/campaigns/${offerId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Modifier l'offre</h1>
          <p className="text-slate-600">Mettez à jour les détails de votre offre</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">
                Titre de l'offre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Recherche influenceur mode pour nouvelle collection"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="objectif">
                Objectif de la collaboration <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="objectif"
                name="objectif"
                value={formData.objectif}
                onChange={handleChange}
                placeholder="Décrivez les objectifs de cette collaboration..."
                rows={4}
                className={errors.objectif ? "border-red-500" : ""}
              />
              {errors.objectif && (
                <p className="text-red-500 text-sm mt-1">{errors.objectif}</p>
              )}
            </div>

            <div>
              <Label htmlFor="requirement">
                Exigences <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="requirement"
                name="requirement"
                value={formData.requirement}
                onChange={handleChange}
                placeholder="Listez les exigences et critères attendus..."
                rows={4}
                className={errors.requirement ? "border-red-500" : ""}
              />
              {errors.requirement && (
                <p className="text-red-500 text-sm mt-1">{errors.requirement}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minBudget">
                  Budget minimum (€) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="minBudget"
                  name="minBudget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minBudget}
                  onChange={handleChange}
                  placeholder="1000"
                  className={errors.minBudget ? "border-red-500" : ""}
                />
                {errors.minBudget && (
                  <p className="text-red-500 text-sm mt-1">{errors.minBudget}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maxBudget">
                  Budget maximum (€) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxBudget"
                  name="maxBudget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  placeholder="5000"
                  className={errors.maxBudget ? "border-red-500" : ""}
                />
                {errors.maxBudget && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxBudget}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Période de collaboration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">
                  Date de début <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">
                  Date de fin <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nombre d'influenceurs */}
        <Card>
          <CardHeader>
            <CardTitle>Influenceurs recherchés</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="influencerNumber">
                Nombre d'influenceurs <span className="text-red-500">*</span>
              </Label>
              <Input
                id="influencerNumber"
                name="influencerNumber"
                type="number"
                min="1"
                max="100"
                value={formData.influencerNumber}
                onChange={handleChange}
                placeholder="5"
                className={errors.influencerNumber ? "border-red-500" : ""}
              />
              {errors.influencerNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.influencerNumber}
                </p>
              )}
              <p className="text-sm text-slate-600 mt-1">
                Nombre d'influenceurs que vous souhaitez recruter pour cette offre
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/company/campaigns/${offerId}`)}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={submitting}
              >
                {submitting ? (
                  "Enregistrement..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
