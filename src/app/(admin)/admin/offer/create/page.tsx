"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import CreateFormOffer from "./_components/CreateFormOffer";

export default function CreateOfferPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-linear-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <h1 className="text-3xl font-semibold text-white">Create Offer</h1>
        </div>
      </div>

      <BreadCrumbList
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Offer", href: "/admin/offer" },
          { label: "Create Offer", href: "/admin/offer/create-category" },
        ]}
      />

      <Card className="bg-slate-900 border-emerald-500/10">
        <CardHeader>
          <CardTitle className="text-white">Offer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateFormOffer />
        </CardContent>
      </Card>
    </div>
  );
}