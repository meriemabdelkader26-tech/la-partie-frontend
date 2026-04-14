"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ResetPasswordRequestPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Appel API pour demander la réinitialisation (à adapter selon votre backend)
      const res = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Erreur lors de la demande.");
      setSuccess(true);
      toast.success("Un email de réinitialisation a été envoyé si l'adresse existe.");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Mot de passe oublié</h1>
        {success ? (
          <p className="text-green-600 text-center">Consultez votre email pour réinitialiser votre mot de passe.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="email" className="block text-sm font-medium">Adresse email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Votre email"
              className="w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordRequestPage;
