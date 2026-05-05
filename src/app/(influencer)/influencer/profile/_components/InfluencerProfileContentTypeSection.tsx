"use client";

import { Influencer } from "@/app/types";
import { Play, Plus, X, Check, Loader2 } from "lucide-react";
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
import { CONTENT_TYPES } from "../../complete-profile/_components/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { UPDATE_PROFILE_PARTIAL } from "./query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileContentTypeSection = (props: Props) => {
  const { data } = props;
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(data?.typeContenu || []);

  const updateMutation = useMutation({
    mutationFn: (types: string[]) => 
      graphqlClient.request(UPDATE_PROFILE_PARTIAL, { typeContenu: types }),
    onSuccess: () => {
      toast.success("Content formats updated");
      queryClient.invalidateQueries({ queryKey: ["influencerProfile"] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update formats");
    }
  });

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSave = () => {
    updateMutation.mutate(selectedTypes);
  };

  return (
    <div className="bg-white border-2 border-black/5 rounded-[32px] p-8 shadow-soft animate-fadeInUp delay-500">
      <div className="flex items-center justify-between mb-8 animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-current" />
          </div>
          <h2 className="font-black text-black uppercase tracking-widest text-xs sm:text-sm">Content Formats</h2>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (open) setSelectedTypes(data?.typeContenu || []);
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-xl border-2 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all h-10">
              <Plus className="w-4 h-4 mr-2" />
              Manage Formats
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Manage Formats</DialogTitle>
              <p className="text-gray-400 font-medium text-sm">Select the types of content you typically create.</p>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-6">
              {CONTENT_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl border-2 font-bold text-sm transition-all duration-300",
                      isSelected 
                        ? "bg-black text-white border-black shadow-md scale-[1.02]" 
                        : "bg-gray-50 text-gray-500 border-transparent hover:border-black/10 hover:bg-white"
                    )}
                  >
                    {type}
                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 opacity-20" />}
                  </button>
                );
              })}
            </div>
            <DialogFooter className="gap-3 sm:justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {selectedTypes.length} formats selected
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
      
      <div className="flex flex-wrap gap-4">
        {data?.typeContenu?.map((type, idx) => (
          <span
            key={type}
            className="bg-gray-50 text-black border-2 border-black/5 px-6 py-3 rounded-2xl font-black text-sm shadow-inner-soft hover:bg-black hover:text-white hover:border-black transition-all duration-300 cursor-default animate-scaleIn"
            style={{ animationDelay: `${600 + idx * 100}ms` }}
          >
            {type}
          </span>
        ))}
        {(!data?.typeContenu || data.typeContenu.length === 0) && (
          <p className="text-gray-400 font-bold italic text-sm">No content formats added yet.</p>
        )}
      </div>
    </div>
  );
};


export default InfluencerProfileContentTypeSection;