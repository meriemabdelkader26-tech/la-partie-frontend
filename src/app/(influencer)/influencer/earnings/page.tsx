"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Wallet,
  CreditCard,
} from "lucide-react";

const EarningsPage = () => {
  const stats = [
    {
      title: "Total Earnings",
      value: "$8,450",
      change: "+15.2%",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "This Month",
      value: "$2,840",
      change: "+22.5%",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Available Balance",
      value: "$3,200",
      change: "",
      icon: Wallet,
      color: "purple",
    },
    {
      title: "Pending",
      value: "$1,450",
      change: "",
      icon: CreditCard,
      color: "yellow",
    },
  ];

  const transactions = [
    {
      id: 1,
      campaign: "Summer Fashion Collection",
      brand: "StyleBrand Co.",
      amount: "$2,500",
      date: "Apr 15, 2024",
      status: "completed",
    },
    {
      id: 2,
      campaign: "Tech Product Launch",
      brand: "TechHub Inc.",
      amount: "$3,200",
      date: "Apr 10, 2024",
      status: "completed",
    },
    {
      id: 3,
      campaign: "Beauty Product Review",
      brand: "GlowBeauty",
      amount: "$1,800",
      date: "Apr 5, 2024",
      status: "completed",
    },
    {
      id: 4,
      campaign: "Wellness Campaign",
      brand: "HealthyLife",
      amount: "$1,450",
      date: "Expected Apr 30",
      status: "pending",
    },
  ];

  const monthlyEarnings = [
    { month: "January", amount: 4200 },
    { month: "February", amount: 5100 },
    { month: "March", amount: 6800 },
    { month: "April", amount: 8450 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Earnings</h1>
          <p className="text-slate-400 mt-1">
            Track your income and manage payouts
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="w-4 h-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-emerald-400" />
                </div>
                {stat.change && (
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Monthly Earnings Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Monthly Earnings
          </h3>
          <div className="space-y-4">
            {monthlyEarnings.map((data) => (
              <div key={data.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{data.month}</span>
                  <span className="text-white font-semibold">
                    ${data.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-linear-to-r from-emerald-600 to-green-400 h-3 rounded-full transition-all"
                    style={{ width: `${(data.amount / 10000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Recent Transactions
            </h3>
            <Button variant="outline" className="border-slate-700">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">
                      {transaction.campaign}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {transaction.brand}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-semibold text-lg">
                      {transaction.amount}
                    </p>
                    <p className="text-slate-400 text-xs">{transaction.date}</p>
                  </div>
                  {transaction.status === "completed" ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Payment Methods
            </h3>
            <Button variant="outline" className="border-slate-700">
              Add New
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border-2 border-emerald-500/30">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-emerald-400" />
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Primary
                </Badge>
              </div>
              <p className="text-white font-medium mb-1">PayPal</p>
              <p className="text-slate-400 text-sm">jane.doe@example.com</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-white font-medium mb-1">Bank Transfer</p>
              <p className="text-slate-400 text-sm">****1234</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EarningsPage;
