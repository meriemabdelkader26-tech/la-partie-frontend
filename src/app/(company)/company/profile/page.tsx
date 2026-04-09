"use client";

import { useEffect, useState } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_COMPANY_PROFILE, UPDATE_COMPANY_PROFILE } from "@/lib/queries/company-queries";
import { Company, CompanySize, DomainActivity, EntrepriseType, DisponibiliteCollaboration } from "@/lib/types/company-types";
import {
  Building2,
  Mail,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Save,
  Edit,
  Image as ImageIcon,
  Settings,
  Phone,
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
      alert("Impossible de charger le profil");
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
        alert("Profil mis à jour avec succès");
        setIsEditing(false);
        fetchCompanyProfile();
      } else {
        alert(data.updateCompanyProfile.message || "Une erreur est survenue");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Impossible de mettre à jour le profil");
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
      <div className="space-y-6">
        <Skeleton className="h-12 w-full bg-slate-800" />
        <Skeleton className="h-96 w-full bg-slate-800" />
      </div>
    );
  }

  if (!company) {
    return (
      <Card className="bg-slate-900 border-emerald-500/10">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Building2 className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Profil non trouvé
          </h3>
          <p className="text-slate-400 text-center mb-4">
            Veuillez compléter votre profil d&apos;entreprise
          </p>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Compléter le profil
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Profil de l&apos;Entreprise 🏢
          </h1>
          <p className="text-slate-400">
            Gérez les informations de votre entreprise
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-slate-700 text-slate-300"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-slate-900 border border-emerald-500/10">
          <TabsTrigger value="general" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Informations Générales
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Mail className="w-4 h-4 mr-2" />
            Contact & Localisation
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="bg-slate-900 border-emerald-500/10">
            <CardHeader>
              <CardTitle className="text-white">Informations de base</CardTitle>
              <CardDescription className="text-slate-400">
                Détails principaux de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-300">
                    Nom de l&apos;entreprise *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricule" className="text-slate-300">
                    Matricule
                  </Label>
                  <Input
                    id="matricule"
                    value={formData.matricule}
                    onChange={(e) =>
                      setFormData({ ...formData, matricule: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-slate-300">
                    Site web
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size" className="text-slate-300">
                    Taille de l&apos;entreprise
                  </Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) =>
                      setFormData({ ...formData, size: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">Petite (1-50 employés)</SelectItem>
                      <SelectItem value="M">Moyenne (51-200 employés)</SelectItem>
                      <SelectItem value="L">Grande (201-1000 employés)</SelectItem>
                      <SelectItem value="XL">Très grande (1001+ employés)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domainActivity" className="text-slate-300">
                    Domaine d&apos;activité
                  </Label>
                  <Select
                    value={formData.domainActivity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, domainActivity: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TECH">Technologie</SelectItem>
                      <SelectItem value="FIN">Finance</SelectItem>
                      <SelectItem value="HLTH">Santé</SelectItem>
                      <SelectItem value="EDU">Éducation</SelectItem>
                      <SelectItem value="ENT">Divertissement</SelectItem>
                      <SelectItem value="MFG">Fabrication</SelectItem>
                      <SelectItem value="RET">Commerce</SelectItem>
                      <SelectItem value="OTH">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entrepriseType" className="text-slate-300">
                    Type d&apos;entreprise
                  </Label>
                  <Select
                    value={formData.entrepriseType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, entrepriseType: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIV">Privée</SelectItem>
                      <SelectItem value="PUB">Publique</SelectItem>
                      <SelectItem value="NGO">ONG</SelectItem>
                      <SelectItem value="GOV">Agence gouvernementale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={5}
                  className="bg-slate-800 border-slate-700 text-white disabled:opacity-70 resize-none"
                  placeholder="Décrivez votre entreprise..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact & Location Tab */}
        <TabsContent value="contact" className="mt-6 space-y-6">
          <Card className="bg-slate-900 border-emerald-500/10">
            <CardHeader>
              <CardTitle className="text-white">Contact</CardTitle>
              <CardDescription className="text-slate-400">
                Informations de contact de l&apos;entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-slate-300">
                  Email de contact
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Email principal (compte)</Label>
                <div className="flex items-center gap-2 p-3 bg-slate-800 border border-slate-700 rounded-md">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">{company.user.email}</span>
                  {company.user.emailVerified && (
                    <Badge className="ml-auto bg-emerald-500/90 text-white">
                      Vérifié
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-emerald-500/10">
            <CardHeader>
              <CardTitle className="text-white">Adresse</CardTitle>
              <CardDescription className="text-slate-400">
                Localisation de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-300">
                  Adresse
                </Label>
                <Input
                  id="address"
                  value={formData.address.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, address: e.target.value },
                    })
                  }
                  disabled={!isEditing}
                  className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-300">
                    Ville
                  </Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-300">
                    État/Région
                  </Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-slate-300">
                    Code postal
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.address.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, postalCode: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-300">
                    Pays
                  </Label>
                  <Input
                    id="country"
                    value={formData.address.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, country: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-70"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6 space-y-6">
          <Card className="bg-slate-900 border-emerald-500/10">
            <CardHeader>
              <CardTitle className="text-white">Disponibilité</CardTitle>
              <CardDescription className="text-slate-400">
                Gérez votre disponibilité pour les collaborations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disponibilite" className="text-slate-300">
                  Disponibilité pour les collaborations
                </Label>
                <Select
                  value={formData.disponibiliteCollaboration}
                  onValueChange={(value) =>
                    setFormData({ ...formData, disponibiliteCollaboration: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="partiellement_disponible">
                      Partiellement disponible
                    </SelectItem>
                    <SelectItem value="occupe">Occupé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-emerald-500/10">
            <CardHeader>
              <CardTitle className="text-white">Informations du compte</CardTitle>
              <CardDescription className="text-slate-400">
                Détails de votre compte utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-md">
                <span className="text-slate-300">Statut du compte</span>
                <Badge
                  className={
                    company.user.isActive
                      ? "bg-emerald-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  }
                >
                  {company.user.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-md">
                <span className="text-slate-300">Profil complété</span>
                <Badge
                  className={
                    company.user.isCompletedProfile
                      ? "bg-emerald-500/90 text-white"
                      : "bg-yellow-500/90 text-white"
                  }
                >
                  {company.user.isCompletedProfile ? "Oui" : "Non"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-md">
                <span className="text-slate-300">Membre depuis</span>
                <span className="text-white">
                  {new Date(company.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
