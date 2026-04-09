"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Heart, MessageCircle, ExternalLink } from "lucide-react";

const PortfolioPage = () => {
  // Mock data - replace with real data from your API
  const portfolioItems = [
    {
      id: 1,
      image:
        "https://via.placeholder.com/400x300/1e293b/10b981?text=Fashion+Campaign",
      title: "Summer Fashion Collection 2024",
      category: "Fashion",
      brand: "StyleBrand",
      date: "March 2024",
      stats: {
        views: "125K",
        likes: "8.5K",
        comments: "342",
      },
    },
    {
      id: 2,
      image:
        "https://via.placeholder.com/400x300/1e293b/10b981?text=Beauty+Product",
      title: "Skincare Routine Review",
      category: "Beauty",
      brand: "GlowCo",
      date: "February 2024",
      stats: {
        views: "98K",
        likes: "7.2K",
        comments: "284",
      },
    },
    {
      id: 3,
      image:
        "https://via.placeholder.com/400x300/1e293b/10b981?text=Tech+Review",
      title: "Latest Tech Gadget Unboxing",
      category: "Technology",
      brand: "TechHub",
      date: "January 2024",
      stats: {
        views: "156K",
        likes: "12.3K",
        comments: "456",
      },
    },
    {
      id: 4,
      image: "https://via.placeholder.com/400x300/1e293b/10b981?text=Lifestyle",
      title: "Day in My Life Vlog",
      category: "Lifestyle",
      brand: "Personal",
      date: "December 2023",
      stats: {
        views: "203K",
        likes: "15.8K",
        comments: "678",
      },
    },
    {
      id: 5,
      image:
        "https://via.placeholder.com/400x300/1e293b/10b981?text=Food+Review",
      title: "Restaurant Review Series",
      category: "Food",
      brand: "FoodieSpot",
      date: "November 2023",
      stats: {
        views: "87K",
        likes: "6.4K",
        comments: "234",
      },
    },
    {
      id: 6,
      image: "https://via.placeholder.com/400x300/1e293b/10b981?text=Travel",
      title: "Travel Destination Guide",
      category: "Travel",
      brand: "TravelMore",
      date: "October 2023",
      stats: {
        views: "142K",
        likes: "11.2K",
        comments: "567",
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-slate-400 mt-1">
            Showcase your best work and campaigns
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <Card
            key={item.id}
            className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-emerald-500/30 transition-all group"
          >
            <div className="relative overflow-hidden aspect-video">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 bg-slate-800/90 hover:bg-slate-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-slate-800/90 hover:bg-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-semibold line-clamp-2">
                  {item.title}
                </h3>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shrink-0">
                  {item.category}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{item.brand}</span>
                <span className="text-slate-500">{item.date}</span>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-slate-700">
                <div className="flex items-center gap-1 text-slate-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">{item.stats.views}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{item.stats.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{item.stats.comments}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State - Show when no items */}
      {portfolioItems.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Portfolio Items Yet
            </h3>
            <p className="text-slate-400 mb-6">
              Start building your portfolio by adding your best work
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PortfolioPage;
