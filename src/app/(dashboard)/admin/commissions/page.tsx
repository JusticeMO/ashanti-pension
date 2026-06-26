"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { Commission, Profile, Application } from "@/lib/types";
import { calculateCommission, CommissionBreakdown } from "@/lib/commission";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge, SectionHeader, Alert } from "@/components/ui";
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
        return <Badge variant="warning">Awaiting Funds</Badge>;
      case "confirmed":
        return <Badge variant="info">Confirmed</Badge>;
      case "paid":
        return <Badge variant="success">Disbursed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading commissions...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-[#A09890] hover:text-[#094029] text-[0.6875rem] font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      <SectionHeader
        overline="Financial Ledger"
        title="Commission Ledgers & Calculator"
        subtitle="Compute premium commission cashbacks and verify disbursement queues."
      />

      {/* Calculator and Breakdown panels */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Calculator Inputs */}
        <Card variant="default" className="md:col-span-5">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calculator className="w-4 h-4 text-[#094029]" />
            <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Formula Calculator</CardTitle>
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
            <div className="text-[11px] text-[#7A746C] leading-relaxed bg-[#F8F6F3] p-3.5 rounded-xl border border-[#EAE7E0]/60">
              This interactive widget shows the breakdown of the 3% gross pension agent commission under Ashanti advisory contracts.
            </div>
          </CardContent>
        </Card>

        {/* Calculator Breakdown Results */}
        <Card variant="flat" className="md:col-span-7 bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#EAE7E0]/60 pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Commission Allocation Matrix</CardTitle>
            <Coins className="w-4 h-4 text-[#C49A45]" />
          </CardHeader>
          <CardContent className="pt-6 text-xs sm:text-sm">
            {breakdown ? (
              <div className="flex flex-col gap-3 font-[family-name:var(--font-heading)] font-bold uppercase tracking-wider text-xs">
                <div className="flex justify-between border-b border-[#EAE7E0]/60 pb-2 text-[#7A746C]">
                  <span>Gross Broker Commission (3.0%)</span>
                  <span className="text-[#1A1714]">KES {breakdown.grossCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-[#EAE7E0]/60 pb-2 text-[#7A746C]">
                  <span>WHT Tax deduction (30.0%)</span>
                  <span className="text-[#B91C1C]">- KES {breakdown.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-[#EAE7E0]/60 pb-2 bg-[#F8F6F3] p-2.5 rounded-xl border border-[#EAE7E0]/80 text-[#1A1714]">
                  <span>Net Commission (Net)</span>
                  <span>KES {breakdown.netCommission.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-3 bg-[#ECFAF2] rounded-xl flex flex-col gap-1.5 border border-[rgba(9,64,41,0.15)]">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#094029]">
                      Client Cashback (50%)
                    </span>
                    <span className="font-extrabold text-[#094029] text-xs">
                      KES {breakdown.clientCashback.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FBF8F0] rounded-xl flex flex-col gap-1.5 border border-[rgba(196,154,69,0.22)]">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#8A6A25]">
                      Ashanti Pool (50%)
                    </span>
                    <span className="font-extrabold text-[#8A6A25] text-xs">
                      KES {breakdown.ashantiPool.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Sub pool breakdown */}
                <div className="flex flex-col gap-2 p-3.5 bg-[#F8F6F3] rounded-xl mt-2 border border-[#EAE7E0]/80">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#A09890]">
                    Ashanti Pool Breakdown (10% Referrer / 90% Retention)
                  </span>
                  <div className="flex justify-between text-[11px] font-medium text-[#7A746C]">
                    <span>Referral Reward (10% of Pool)</span>
                    <span className="font-bold text-[#1A1714]">KES {breakdown.referralPayout.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium text-[#094029] border-t border-[#EAE7E0]/40 pt-1.5">
                    <span>Ashanti Retention (90% of Pool)</span>
                    <span className="font-bold text-[#094029]">KES {breakdown.ashantiRetention.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-[#A09890] text-xs uppercase tracking-wider font-bold">
                Please enter a positive numeric contribution amount.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* List of Active Commissions */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#EAE7E0]/60">
          <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Active Settlement Queue</CardTitle>
          <Landmark className="w-4 h-4 text-[#094029]" />
        </CardHeader>
        <CardContent className="p-0">
          {commissions.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#A09890]">
              No commissions pending settlement. Complete client policy options first.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F6F3] text-[#7A746C] border-b border-[#EAE7E0]/60 uppercase tracking-widest font-bold font-[family-name:var(--font-heading)]">
                    <th className="p-4 pl-6">Client Case</th>
                    <th className="p-4">Monthly Premium</th>
                    <th className="p-4">Client Cashback</th>
                    <th className="p-4">Referral Payout</th>
                    <th className="p-4">Disbursement Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE7E0]/40 font-medium text-[#4A4540]">
                  {commissions.map((com) => (
                    <tr key={com.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4 pl-6 font-bold text-[#1A1714] font-[family-name:var(--font-heading)] uppercase tracking-wider">{getClientName(com.applicationId)}</td>
                      <td className="p-4 text-[#7A746C]">KES {com.premium.toLocaleString()}</td>
                      <td className="p-4 text-[#094029] font-bold">
                        KES {com.clientCashback.toLocaleString()}
                      </td>
                      <td className="p-4 text-[#8A6A25] font-bold">
                        KES {com.referralPayout.toLocaleString()}
                      </td>
                      <td className="p-4">{getStatusBadge(com.status)}</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex gap-2 justify-end">
                          {com.status === "pending" && (
                            <Button
                              onClick={() => handleConfirm(com.id)}
                              size="sm"
                              variant="secondary"
                              className="text-[10px] py-1.5 px-3"
                            >
                              Confirm Funds
                            </Button>
                          )}
                          {com.status === "confirmed" && (
                            <Button
                              onClick={() => handlePay(com.id)}
                              size="sm"
                              variant="outline-green"
                              className="text-[10px] py-1.5 px-3"
                            >
                              Disburse
                            </Button>
                          )}
                          {com.status === "paid" && (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
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
