"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InfluencerProfileStat from "./InfluencerProfileStat";
import InfluencerProfileLanguageChip from "./InfluencerProfileLanguageChip";
import { Plus, Check, Loader2, Languages } from "lucide-react";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { UPDATE_PROFILE_PARTIAL } from "./query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InfluencerProfileHeaderSectionProps {
  data: any;
}

const InfluencerProfileHeaderSection = ({ data }: InfluencerProfileHeaderSectionProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(data?.langues || []);

  const updateMutation = useMutation({
    mutationFn: (langs: string[]) => 
      graphqlClient.request(UPDATE_PROFILE_PARTIAL, { langues: langs }),
    onSuccess: () => {
      toast.success("Languages updated");
      queryClient.invalidateQueries({ queryKey: ["influencerProfile"] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update languages");
    }
  });

  const toggleLang = (lang: string) => {
    setSelectedLangs(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleSave = () => {
    updateMutation.mutate(selectedLangs);
  };

  return (
    <div className="p-10 border-b-2 border-black/5 bg-white">
      <div className="flex flex-col md:flex-row gap-10 items-start animate-fadeIn">
        <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-white shadow-large animate-scaleIn shrink-0">
          <AvatarImage
            src={data?.profilePicture}
            className="object-cover"
          />
          <AvatarFallback className="bg-black text-white text-4xl font-bold">
            {data?.pseudo ? data.pseudo.substring(0, 2).toUpperCase() : data?.user?.name?.substring(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 animate-slideInRight delay-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-4xl font-black text-black tracking-tight">{data?.pseudo || data?.user?.name}</h1>
              <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-100 shadow-sm self-start sm:self-center">
                {data?.disponibiliteCollaboration?.replace(/_/g, " ")}
              </span>
            </div>
            
            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (open) setSelectedLangs(data?.langues || []);
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl border-2 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all h-10">
                  <Languages className="w-4 h-4 mr-2" />
                  Manage Languages
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Languages</DialogTitle>
                  <p className="text-gray-400 font-medium text-sm">Select the languages you can create content in.</p>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-6">
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLangs.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLang(lang)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-2xl border-2 font-bold text-sm transition-all duration-300",
                          isSelected 
                            ? "bg-black text-white border-black shadow-md scale-[1.02]" 
                            : "bg-gray-50 text-gray-500 border-transparent hover:border-black/10 hover:bg-white"
                        )}
                      >
                        {lang}
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 opacity-20" />}
                      </button>
                    );
                  })}
                </div>
                <DialogFooter className="gap-3 sm:justify-between items-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {selectedLangs.length} languages selected
                  </p>
                  <Button 
                    onClick={handleSave} 
                    disabled={updateMutation.isPending}
                    className="bg-black text-white font-black rounded-xl h-12 px-8 shadow-xl hover:shadow-black/20 transition-all min-w-[120px]"
                  >
                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-500 font-bold text-lg mb-4 tracking-tight">@{data?.instagramUsername}</p>
          <p className="text-gray-600 mb-8 whitespace-pre-line font-medium leading-relaxed max-w-2xl text-base">
            {data?.biography}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfluencerProfileStat
              label="Followers"
              value={`${data?.statistiquesGlobales?.followersTotaux || data?.reseauxSociaux?.[0]?.nombreAbonnes || '0'}`}
              className="animate-fadeInUp"
              style={{ animationDelay: '400ms' }}
            />
            <InfluencerProfileStat
              label="Engagement Rate"
              value={`${data?.statistiquesGlobales?.engagementMoyenGlobal?.toFixed(2) || data?.reseauxSociaux?.[0]?.tauxEngagement || '0'}%`}
              className="animate-fadeInUp"
              style={{ animationDelay: '500ms' }}
            />
            <InfluencerProfileStat
              label="Avg. Likes"
              value={`${data?.reseauxSociaux?.[0]?.moyenneLikes || '0'}`}
              className="animate-fadeInUp"
              style={{ animationDelay: '600ms' }}
            />
          </div>

          <div className="flex flex-wrap gap-3 animate-fadeInUp delay-700">
            {data?.langues?.map((lang: string, idx: number) => (
              <InfluencerProfileLanguageChip key={lang} label={lang} />
            ))}
            {(!data?.langues || data.langues.length === 0) && (
              <p className="text-gray-400 font-bold italic text-sm">No languages added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default InfluencerProfileHeaderSection;
