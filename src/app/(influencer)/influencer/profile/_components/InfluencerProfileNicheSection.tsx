"use client";

import { Influencer, Category } from "@/app/types";
import { Target, Plus, Check, Loader2 } from "lucide-react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { UPDATE_PROFILE_PARTIAL } from "./query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CATEGORIES_LIST_KEY } from "@/constant";

const CATEGORIES_QUERY = `
query allCategories($isActive: Boolean) {
  allCategories(isActive: $isActive) {
    edges {
      node {
        id
        name
        description
      }
    }
  }
}
`;

interface Props {
  data: Influencer | null;
}
const InfluencerProfileNicheSection = (props: Props) => {
  const { data } = props;
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCats, setSelectedLangs] = useState<string[]>(data?.selectedCategories?.map(c => c.id) || []);

  const { data: categoriesData, isLoading: isLoadingCats } = useQuery<any>({
    queryKey: [CATEGORIES_LIST_KEY],
    queryFn: () => graphqlClient.request(CATEGORIES_QUERY, { isActive: true }),
    enabled: isOpen
  });

  const categories = categoriesData?.allCategories?.edges?.map((e: any) => e.node) || [];

  const updateMutation = useMutation({
    mutationFn: (catIds: string[]) => 
      graphqlClient.request(UPDATE_PROFILE_PARTIAL, { selectedCategories: catIds }),
    onSuccess: () => {
      toast.success("Niches updated");
      queryClient.invalidateQueries({ queryKey: ["influencerProfile"] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update niches");
    }
  });

  const toggleCat = (catId: string) => {
    setSelectedLangs(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSave = () => {
    updateMutation.mutate(selectedCats);
  };

  return (
    <div className="mb-12 animate-fadeIn">
      <div className="flex items-center justify-between mb-8 animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">Niches & Expertise</h2>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (open) setSelectedLangs(data?.selectedCategories?.map(c => c.id) || []);
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-xl border-2 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all h-10">
              <Plus className="w-4 h-4 mr-2" />
              Manage Niches
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Manage Niches</DialogTitle>
              <p className="text-gray-400 font-medium text-sm">Select up to 5 categories that match your content style.</p>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingCats ? (
                <div className="col-span-2 flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
                </div>
              ) : (
                categories.map((cat: Category) => {
                  const isSelected = selectedCats.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCat(cat.id)}
                      className={cn(
                        "flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-300 text-left",
                        isSelected 
                          ? "bg-black text-white border-black shadow-md scale-[1.02]" 
                          : "bg-gray-50 text-gray-500 border-transparent hover:border-black/10 hover:bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-sm">{cat.name}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                      <p className={cn("text-[10px] line-clamp-1", isSelected ? "text-white/60" : "text-gray-400")}>
                        {cat.description || "Niche for your content"}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
            <DialogFooter className="gap-3 sm:justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {selectedCats.length} niches selected
              </p>
              <Button 
                onClick={handleSave} 
                disabled={updateMutation.isPending || selectedCats.length === 0}
                className="bg-black text-white font-black rounded-xl h-12 px-8 shadow-xl hover:shadow-black/20 transition-all min-w-[120px]"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.selectedCategories?.map((category, idx) => (
          <div
            key={category.id}
            className="bg-white border-2 border-black/5 p-8 rounded-3xl shadow-soft hover:shadow-medium hover:border-black/20 transition-all duration-500 group animate-fadeInUp"
            style={{ animationDelay: `${200 + idx * 100}ms` }}
          >
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300">
              <span className="font-black text-xs">{idx + 1}</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">
              {category.name}
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">{category.description}</p>
          </div>
        ))}
        {(!data?.selectedCategories || data.selectedCategories.length === 0) && (
          <div className="col-span-full py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-black/5 text-center">
            <p className="text-gray-400 font-bold italic">No niches selected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default InfluencerProfileNicheSection;
