"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { Commission, Profile, Application } from "@/lib/types";
import { calculateCommission, CommissionBreakdown } from "@/lib/commission";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from "@/components/ui";
import { Percent, ArrowLeft, Coins, Calculator, Check, ArrowDownRight, Landmark } from "lucide-react";

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculator State
  const [calcInput, setCalcInput] = useState("100000");
  const [breakdown, setBreakdown] = useState<CommissionBreakdown | null>(null);

  const loadData = () => {
    setCommissions(MockStore.getCommissions());
    setProfiles(MockStore.getProfiles());
    setApps(MockStore.getApplications());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update calculator whenever calcInput changes
  useEffect(() => {
    const val = parseFloat(calcInput);
    if (!isNaN(val) && val > 0) {
      setBreakdown(calculateCommission(val));
    } else {
      setBreakdown(null);
    }
  }, [calcInput]);

  const getClientName = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return "Unknown";
    return profiles.find((p) => p.id === app.clientId)?.fullName || "Unknown Client";
  };

  const handleConfirm = (comId: string) => {
    const res = MockStore.confirmCommission(comId);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handlePay = (comId: string) => {
    const res = MockStore.payCommission(comId);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Awaiting Fund Reception</Badge>;
      case "confirmed":
        return <Badge variant="info">Disbursements Confirmed</Badge>;
      case "paid":
        return <Badge variant="success">All Payouts Disbursed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading commissions...</div>;
  }

  return (
    <div className="flex flex-col gap-8 font-sans">
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C49A45]">Financial Ledger</span>
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          Commission Ledgers & Calculator
        </h1>
        <p className="text-sm text-slate-400">
          Compute premium commission cashbacks and verify disbursement queues.
        </p>
      </div>

      {/* Calculator and Breakdown panels */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Calculator Inputs */}
        <Card className="md:col-span-5">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calculator className="w-5 h-5 text-[#094029]" />
            <CardTitle className="text-base font-serif">Formula Calculator</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="calcVal">Monthly Premium Contribution (KES)</Label>
              <Input
                id="calcVal"
                type="number"
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                placeholder="e.g. 100000"
              />
            </div>
            <div className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              This interactive widget shows the breakdown of the 3% gross pension agent commission under Ashanti advisory contracts.
            </div>
          </CardContent>
        </Card>

        {/* Calculator Breakdown Results */}
        <Card className="md:col-span-7 bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-3 border-slate-100">
            <CardTitle className="text-base font-serif">Commission Allocation Matrix</CardTitle>
            <Coins className="w-4 h-4 text-[#C49A45]" />
          </CardHeader>
          <CardContent className="pt-6 font-sans text-xs sm:text-sm">
            {breakdown ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Gross Broker Commission (3.0%)</span>
                  <span className="font-bold text-slate-800">KES {breakdown.grossCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">WHT Tax deduction (30.0%)</span>
                  <span className="font-semibold text-rose-600">- KES {breakdown.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-slate-900 font-bold bg-slate-50 p-2 rounded-lg">
                  <span>Net Commission (Net)</span>
                  <span>KES {breakdown.netCommission.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-3 bg-[#ECFAF2] rounded-xl flex flex-col gap-1 border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-800">
                      Client Cashback (50%)
                    </span>
                    <span className="font-bold text-emerald-950 text-sm">
                      KES {breakdown.clientCashback.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FBF6EC] rounded-xl flex flex-col gap-1 border border-amber-100">
                    <span className="text-[10px] uppercase font-bold text-[#A37F35]">
                      Ashanti Advisory Pool (50%)
                    </span>
                    <span className="font-bold text-amber-950 text-sm">
                      KES {breakdown.ashantiPool.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Sub pool breakdown */}
                <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl mt-2 border border-slate-200/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Ashanti Pool Breakdown (10% Referrer / 90% Retention)
                  </span>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Referral Reward (10% of Pool)</span>
                    <span className="font-semibold">KES {breakdown.referralPayout.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#094029] font-bold">
                    <span>Ashanti Retention (90% of Pool)</span>
                    <span>KES {breakdown.ashantiRetention.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                Please enter a positive numeric contribution amount to display allocation statistics.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* List of Active Commissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-serif">Active Settlement Queue</CardTitle>
          <Landmark className="w-4 h-4 text-[#094029]" />
        </CardHeader>
        <CardContent className="p-0">
          {commissions.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No commissions pending settlement. Complete client policy options first.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-bold">
                    <th className="p-4 pl-6">Client Case</th>
                    <th className="p-4">Monthly Premium</th>
                    <th className="p-4">Client Cashback</th>
                    <th className="p-4">Referral Payout</th>
                    <th className="p-4">Disbursement Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {commissions.map((com) => (
                    <tr key={com.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-semibold">{getClientName(com.applicationId)}</td>
                      <td className="p-4 text-slate-500">KES {com.premium.toLocaleString()}</td>
                      <td className="p-4 text-emerald-700 font-bold">
                        KES {com.clientCashback.toLocaleString()}
                      </td>
                      <td className="p-4 text-[#A37F35] font-bold">
                        KES {com.referralPayout.toLocaleString()}
                      </td>
                      <td className="p-4">{getStatusBadge(com.status)}</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex gap-2 justify-end">
                          {com.status === "pending" && (
                            <Button
                              onClick={() => handleConfirm(com.id)}
                              size="sm"
                              className="text-[10px] py-1 px-3"
                            >
                              Confirm Funds
                            </Button>
                          )}
                          {com.status === "confirmed" && (
                            <Button
                              onClick={() => handlePay(com.id)}
                              size="sm"
                              variant="outline-green"
                              className="text-[10px] py-1 px-3"
                            >
                              Disburse Payouts
                            </Button>
                          )}
                          {com.status === "paid" && (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Disbursed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
