"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($email: String!, $newPassword: String!, $token: String!) {
    resetPassword(email: $email, newPassword: $newPassword, token: $token) {
      success
      message
    }
  }
`;

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirm) {
      setError("Veuillez remplir les deux champs.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res: any = await graphqlClient.request(RESET_PASSWORD_MUTATION, {
        email,
        newPassword: password,
        token
      });

      if (!res.resetPassword?.success) {
        throw new Error(res.resetPassword?.message || "Erreur lors de la réinitialisation.");
      }
      
      setSuccess(true);
      toast.success(res.resetPassword.message || "Mot de passe réinitialisé avec succès.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.errors?.[0]?.message || err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Nouveau mot de passe</h1>
        {success ? (
          <p className="text-green-600 text-center">Mot de passe modifié. Redirection...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              required
              className="w-full"
            />
            <Input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
              className="w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi..." : "Réinitialiser le mot de passe"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
