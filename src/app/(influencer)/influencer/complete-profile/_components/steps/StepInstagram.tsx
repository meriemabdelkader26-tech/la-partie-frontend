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
import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_IMAGE_PROXY } from "@/config";
import { CheckCircle2, Instagram, Link as LinkIcon, Mail, MapPin } from "lucide-react";

const formatNumber = (num?: number) => {
  if (num === undefined) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

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
    const proxyUrl = formData.instagramData.profile_pic_url ? `${NEXT_PUBLIC_BASE_URL}${NEXT_PUBLIC_IMAGE_PROXY}${encodeURIComponent(formData.instagramData.profile_pic_url)}` : "";

    return (
      <div className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/10 shadow-large animate-fadeInUp relative overflow-hidden group">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-black/5 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700"></div>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-black/5">
                {formData.instagramData.profile_pic_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={proxyUrl} 
                    alt={formData.instagramData.username} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-black flex items-center justify-center text-white text-3xl font-black" style={{ display: formData.instagramData.profile_pic_url ? 'none' : 'flex' }}>
                  {formData.instagramData.username?.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-md animate-scaleIn delay-300">
                <Instagram className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-3xl font-black text-black tracking-tight">
                  {formData.instagramData.full_name || formData.instagramData.username}
                </h3>
                {formData.instagramData.is_verified && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4" stroke="white"/></svg>
                )}
              </div>
              <p className="text-gray-500 font-medium text-lg mb-4">
                @{formData.instagramData.username}
              </p>
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-black/10 text-black text-sm font-semibold rounded-full transition-colors"
              >
                Change Account
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8 animate-fadeInUp delay-100">
            <div className="bg-black text-white rounded-2xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform duration-300 shadow-medium">
              <span className="text-3xl font-black mb-1">{formatNumber(formData.instagramData.follower_count)}</span>
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Followers</span>
            </div>
            <div className="bg-white border border-black/10 text-black rounded-2xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-medium">
              <span className="text-3xl font-black mb-1">{formatNumber(formData.instagramData.following_count)}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Following</span>
            </div>
            <div className="bg-white border border-black/10 text-black rounded-2xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-medium">
              <span className="text-3xl font-black mb-1">{formatNumber(formData.instagramData.media_count)}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Posts</span>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-6 animate-fadeInUp delay-200">
            {formData.instagramData.biography && (
              <div>
                <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-3">Biography</h4>
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                  {formData.instagramData.biography}
                </p>
              </div>
            )}

            {(formData.instagramData.public_email || formData.instagramData.external_url || formData.instagramData.category) && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-black/10">
                {formData.instagramData.category && (
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-black/5 px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {formData.instagramData.category}
                  </div>
                )}
                {formData.instagramData.public_email && (
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-black/5 px-4 py-2 rounded-full">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {formData.instagramData.public_email}
                  </div>
                )}
                {formData.instagramData.external_url && (
                  <a 
                    href={formData.instagramData.external_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-black hover:text-blue-600 bg-black/5 hover:bg-black/10 px-4 py-2 rounded-full transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Website Link
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fadeInUp delay-300">
            <div className="bg-white p-8 rounded-[2rem] border border-black/10 shadow-sm">
              <h4 className="text-xl font-bold text-black mb-6">Profile Details</h4>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="pseudo"
                label="Display Name (Optional)"
                placeholder="How you want to be called on the platform"
              />

              {Object.keys(form.formState.errors).length > 0 && (
                <div className="mt-6 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
                  Form errors: {JSON.stringify(form.formState.errors)}
                </div>
              )}
            </div>

            <SubmitButton 
              isLoading={false} 
              className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-lg shadow-medium hover:shadow-large transition-all duration-300 hover:scale-[1.02]"
            >
              Continue to Next Step
            </SubmitButton>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-gray-600 text-lg">
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
          <SecondButton
            label="Fetch Info"
            onClick={handleFetchInstagram}
            isLoading={loading}
            className="h-12"
          />
        </div>
        <div className="flex items-start gap-4 bg-yellow-50 border-2 border-yellow-400/30 py-4 px-5 rounded-xl">
          <CheckCircle2 className="size-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-800 text-sm font-medium leading-relaxed">
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
