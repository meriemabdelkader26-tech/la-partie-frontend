"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const CampaignsPage = () => {
  const campaigns = {
    active: [
      {
        id: 1,
        title: "Summer Fashion Collection 2024",
        brand: "StyleBrand Co.",
        budget: "$2,500",
        deadline: "May 15, 2024",
        status: "in-progress",
        progress: 60,
        description:
          "Promote the new summer collection with 3 Instagram posts and 2 stories",
      },
      {
        id: 2,
        title: "Tech Product Launch",
        brand: "TechHub Inc.",
        budget: "$3,200",
        deadline: "May 20, 2024",
        status: "in-progress",
        progress: 35,
        description: "Create unboxing video and review post for new gadget",
      },
    ],
    pending: [
      {
        id: 3,
        title: "Wellness Product Review",
        brand: "HealthyLife",
        budget: "$1,800",
        deadline: "June 1, 2024",
        status: "pending",
        description: "Review wellness products and share your experience",
      },
      {
        id: 4,
        title: "Food & Beverage Promotion",
        brand: "TastyBites",
        budget: "$2,100",
        deadline: "June 5, 2024",
        status: "pending",
        description: "Feature new menu items in your food review series",
      },
    ],
    completed: [
      {
        id: 5,
        title: "Winter Collection Campaign",
        brand: "FashionForward",
        budget: "$2,800",
        completedDate: "March 10, 2024",
        status: "completed",
        rating: 5,
        description:
          "Successfully promoted winter collection with high engagement",
      },
      {
        id: 6,
        title: "Beauty Product Launch",
        brand: "GlowBeauty",
        budget: "$2,200",
        completedDate: "February 20, 2024",
        status: "completed",
        rating: 5,
        description: "Created engaging content for new skincare line",
      },
    ],
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaigns</h1>
          <p className="text-slate-400 mt-1">
            Manage your active and completed campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-slate-800 border-slate-700">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="bg-slate-800 border-slate-700">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="active">
            Active ({campaigns.active.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({campaigns.pending.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({campaigns.completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {campaigns.active.map((campaign) => (
            <Card
              key={campaign.id}
              className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 transition-colors"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {campaign.title}
                      </h3>
                      {renderStatusBadge(campaign.status)}
                    </div>
                    <p className="text-slate-400 mb-4">
                      {campaign.description}
                    </p>
                    <p className="text-slate-500">Brand: {campaign.brand}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">Budget: {campaign.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">Due: {campaign.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">
                      Progress: {campaign.progress}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-emerald-400">
                      {campaign.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    View Details
                  </Button>
                  <Button variant="outline" className="border-slate-700">
                    Update Progress
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {campaigns.pending.map((campaign) => (
            <Card
              key={campaign.id}
              className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 transition-colors"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {campaign.title}
                      </h3>
                      {renderStatusBadge(campaign.status)}
                    </div>
                    <p className="text-slate-400 mb-4">
                      {campaign.description}
                    </p>
                    <p className="text-slate-500">Brand: {campaign.brand}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">Budget: {campaign.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">
                      Deadline: {campaign.deadline}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Accept Campaign
                  </Button>
                  <Button variant="outline" className="border-slate-700">
                    Decline
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {campaigns.completed.map((campaign) => (
            <Card
              key={campaign.id}
              className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 transition-colors"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {campaign.title}
                      </h3>
                      {renderStatusBadge(campaign.status)}
                    </div>
                    <p className="text-slate-400 mb-4">
                      {campaign.description}
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="text-slate-500">
                        Brand: {campaign.brand}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm">
                          Earned: {campaign.budget}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm">
                          {campaign.completedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="border-slate-700">
                    View Details
                  </Button>
                  <Button variant="outline" className="border-slate-700">
                    Download Report
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignsPage;
