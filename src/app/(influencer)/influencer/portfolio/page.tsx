"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Eye,
  ExternalLink,
  Heart,
  MessageCircle,
} from "lucide-react";

const PortfolioPage = () => {
  const portfolioItems = [
    {
      id: 1,
      title: "Summer Collection 2024",
      brand: "FashionBrand Co.",
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
      date: "Mar 2024",
      stats: { views: "125K", likes: "12.4K", comments: "850" },
    },
    {
      id: 2,
      title: "Tech Review: NextGen Laptop",
      brand: "TechHub Inc.",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
      date: "Feb 2024",
      stats: { views: "85K", likes: "5.2K", comments: "420" },
    },
    {
      id: 3,
      title: "Wellness Routine Guide",
      brand: "HealthyLife",
      category: "Health & Wellness",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      date: "Jan 2024",
      stats: { views: "210K", likes: "18.9K", comments: "1.2K" },
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInDown">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Portfolio</h1>
          <p className="text-gray-500 font-medium mt-1">
            Showcase your best work and campaigns
          </p>
        </div>
        <Button className="bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-6 font-bold shadow-soft transition-all duration-300 hover:scale-[1.02] group">
          <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Add New Item
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioItems.map((item, idx) => (
          <Card
            key={item.id}
            className="bg-white border-2 border-black/5 overflow-hidden hover:border-black/20 hover:shadow-medium transition-all duration-500 group rounded-3xl shadow-soft animate-fadeInUp"
            style={{ animationDelay: `${200 + idx * 150}ms` }}
          >
            <div className="relative overflow-hidden aspect-video bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white text-black hover:bg-black hover:text-white font-bold rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100 delay-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Project
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white text-black hover:bg-black hover:text-white rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-150 opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-black font-bold text-lg leading-tight group-hover:text-gray-700 transition-colors">
                  {item.title}
                </h3>
                <Badge className="bg-gray-100 text-black border-transparent shrink-0 rounded-full px-3 py-0.5 font-bold text-[10px] uppercase tracking-widest">
                  {item.category}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-bold">Brand: <span className="text-black">{item.brand}</span></span>
                <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">{item.date}</span>
              </div>
              <div className="flex items-center gap-6 pt-5 border-t border-black/5">
                <div className="flex items-center gap-2 text-gray-500 group/stat">
                  <Eye className="w-4 h-4 text-black group-hover/stat:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-black">{item.stats.views}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 group/stat">
                  <Heart className="w-4 h-4 text-black group-hover/stat:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-black">{item.stats.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 group/stat">
                  <MessageCircle className="w-4 h-4 text-black group-hover/stat:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-black">{item.stats.comments}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Empty State / Add New Placeholder */}
        <Card className="bg-gray-50/50 border-2 border-black/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] hover:border-black/20 hover:bg-white hover:shadow-soft transition-all duration-500 group animate-fadeInUp delay-700">
          <div className="w-16 h-16 rounded-[20px] bg-white border border-black/5 shadow-soft flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-black transition-all duration-500 shadow-inner-soft">
            <Plus className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-black mb-1">Add New Item</h3>
          <p className="text-gray-500 font-medium max-w-[200px] text-sm leading-relaxed">
            Click here to add a new project to your professional portfolio
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioPage;
