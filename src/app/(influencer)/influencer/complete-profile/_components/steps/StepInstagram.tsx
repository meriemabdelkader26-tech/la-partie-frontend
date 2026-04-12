"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1InstagramSchema, Step1InstagramType } from "../schema";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { ProfileFormData } from "../types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchInstagramPosts, fetchInstagramReels, simplifyReelsData } from "@/lib/instagram-api";
import apiClient from "@/lib/api_client";
import SecondButton from "@/components/shared/SecondButton";
import { TriangleAlertIcon } from "lucide-react";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepInstagram({ formData, onUpdate, onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<Step1InstagramType>({
    resolver: zodResolver(Step1InstagramSchema),
    defaultValues: {
      instagramUsername: formData.instagramUsername || "",
      pseudo: formData.pseudo || "",
    },
  });

  // Update form values when formData changes (especially after fetching Instagram data)
  useEffect(() => {
    if (formData.instagramUsername) {
      form.setValue("instagramUsername", formData.instagramUsername);
    }
    if (formData.pseudo) {
      form.setValue("pseudo", formData.pseudo);
    }
  }, [formData.instagramUsername, formData.pseudo, form]);

  const onSubmit = async (data: Step1InstagramType) => {
    console.log("Form submitted with data:", data);
    onUpdate({
      instagramUsername: data.instagramUsername,
      pseudo: data.pseudo || "",
    });
    console.log("Calling onNext...");
    onNext();
  };

  const handleFetchInstagram = async () => {
    const isValid = await form.trigger("instagramUsername");
    if (!isValid) {
      return;
    }

    const username = form.getValues("instagramUsername");
    onUpdate({ instagramUsername: username });
    setLoading(true);
    setError("");
    try {
      const userInfoResponse = await apiClient.post("/userInfo", { username });
      // Log du JSON brut reçu
      console.log("[INSTAGRAM] userInfoResponse:", JSON.stringify(userInfoResponse.data, null, 2));


      // Supporte tous les formats de réponse RapidAPI (data, graphql, result[0].user, etc)
      let userInfo = userInfoResponse.data || {};
      // Format: { result: [ { user: {...} } ] }
      if (Array.isArray(userInfo.result) && userInfo.result.length > 0 && userInfo.result[0].user) {
        userInfo = userInfo.result[0].user;
      }
      if (userInfo.data) userInfo = userInfo.data;
      if (userInfo.graphql && userInfo.graphql.user) userInfo = userInfo.graphql.user;

      // Extraction ultra-robuste des valeurs (tente toutes les variantes connues)
      const follower_count =
        userInfo.follower_count ||
        userInfo.followers ||
        userInfo.edge_followed_by?.count ||
        userInfo.counts?.followed_by ||
        userInfo.counts?.followers ||
        userInfo.followed_by ||
        userInfo.edge_followed_by_count ||
        userInfo.graphql?.user?.edge_followed_by?.count ||
        0;
      const following_count =
        userInfo.following_count ||
        userInfo.following ||
        userInfo.edge_follow?.count ||
        userInfo.counts?.follows ||
        userInfo.counts?.following ||
        userInfo.edge_follow_count ||
        userInfo.graphql?.user?.edge_follow?.count ||
        0;
      const media_count =
        userInfo.media_count ||
        userInfo.posts ||
        userInfo.counts?.media ||
        userInfo.edge_owner_to_timeline_media?.count ||
        userInfo.media ||
        userInfo.graphql?.user?.edge_owner_to_timeline_media?.count ||
        0;

      // Si toutes les valeurs sont à 0, afficher un message d'erreur explicite
      if (follower_count === 0 && following_count === 0 && media_count === 0) {
        setError("Aucune donnée trouvée pour ce compte. Vérifiez que le compte est public et existe. Regardez la console pour le JSON brut reçu, puis contactez le support si besoin.");
        return;
      }

      // 2. Récupérer les posts et reels
      const postsResponse = await fetchInstagramPosts(username);
      const reelsResponse = await fetchInstagramReels(username);

      // Normalisation des reels pour éviter toute erreur de parsing côté Next.js
      const simplifiedReels = simplifyReelsData(reelsResponse);

      // 3. On considère qu'on a des données si au moins un post ou reel existe
      if ((postsResponse.data.items && postsResponse.data.items.length > 0) ||
          (simplifiedReels && simplifiedReels.length > 0)) {
        onUpdate({
          instagramUsername: username,
          instagramData: {
            username: userInfo.username || username,
            full_name: userInfo.full_name || userInfo.name || "",
            biography: userInfo.biography || userInfo.bio || "",
            profile_pic_url: userInfo.profile_pic_url || userInfo.profile_picture || userInfo.profile_pic_url_hd || "",
            follower_count,
            following_count,
            media_count,
            public_email: userInfo.public_email || "",
            ...userInfo,
          },
          posts: postsResponse.data.items,
          reels: simplifiedReels,
        });
        setTimeout(onNext, 1000);
      } else {
        setError("No public posts or reels found for this account.");
      }
    } catch (err) {
      console.error("Instagram fetch error:", err);
      setError("Failed to fetch Instagram data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (formData.instagramData) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-emerald-600 text-white text-xl font-semibold">
                {formData.instagramData.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">
                @{formData.instagramData.username}
              </h3>
              {formData.instagramData.full_name && (
                <p className="text-slate-400 text-sm">
                  {formData.instagramData.full_name}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                onUpdate({
                  instagramData: null,
                  instagramUsername: "",
                  pseudo: "",
                  selectedReels: [],
                  selectedPosts: [],
                });
                form.reset({
                  instagramUsername: "",
                  pseudo: "",
                });
              }}
              className="text-slate-400 hover:text-emerald-400 text-sm underline"
            >
              Change Account
            </button>
          </div>

          {formData.instagramData.biography && (
            <p className="text-slate-300 text-sm mb-4 whitespace-pre-line">
              {formData.instagramData.biography}
            </p>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-600 rounded p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {formData.instagramData.follower_count >= 1000
                  ? `${(formData.instagramData.follower_count / 1000).toFixed(
                      1
                    )}K`
                  : formData.instagramData.follower_count}
              </p>
              <p className="text-xs text-slate-400">Followers</p>
            </div>
            <div className="bg-slate-600 rounded p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {formData.instagramData.following_count >= 1000
                  ? `${(formData.instagramData.following_count / 1000).toFixed(
                      1
                    )}K`
                  : formData.instagramData.following_count}
              </p>
              <p className="text-xs text-slate-400">Following</p>
            </div>
            <div className="bg-slate-600 rounded p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {formData.instagramData.media_count}
              </p>
              <p className="text-xs text-slate-400">Posts</p>
            </div>
          </div>

          {formData.instagramData.public_email && (
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-slate-400">Email:</span>{" "}
              {formData.instagramData.public_email}
            </p>
          )}

          {formData.instagramData.biography_email && (
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-slate-400">Contact:</span>{" "}
              {formData.instagramData.biography_email}
            </p>
          )}

          {formData.instagramData.external_url && (
            <p className="text-slate-300 text-sm">
              <span className="text-slate-400">Website:</span>{" "}
              <a
                href={formData.instagramData.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300"
              >
                {formData.instagramData.external_url}
              </a>
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="pseudo"
              label="Display Name (Optional)"
              placeholder="How you want to be called"
            />

            {Object.keys(form.formState.errors).length > 0 && (
              <div className="text-red-400 text-sm">
                Form errors: {JSON.stringify(form.formState.errors)}
              </div>
            )}

            <SubmitButton isLoading={false}>Continue</SubmitButton>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-slate-300">
          Connect your Instagram account to get started
        </p>

        {error && <ErrorTriangle message={error} />}

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="instagramUsername"
              label="Instagram Username"
              placeholder="Enter your Instagram username"
            />
          </div>
          <div className="pb-1">
            <SecondButton
              label="Fetch Info"
              onClick={handleFetchInstagram}
              isLoading={loading}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 bg-yellow-400/10 border border-yellow-600 py-2 px-3 rounded-md">
          <TriangleAlertIcon className="size-11 text-yellow-500" />
          <p className=" text-yellow-500 text-sm font-medium">
            When you click “Fetch Info”, we’ll retrieve your public Instagram
            data to help automatically fill in your profile details. Your
            Instagram password will never be stored or accessed. You can also
            choose to manually enter your username and continue.
          </p>
        </div>

        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </form>
    </Form>
  );
}
