"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { Referral, Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Copy, Check, Users, Gift, Hourglass, Landmark, UserPlus } from "lucide-react";

export default function ReferrerDashboard() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://ashantipension.com");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = MockStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      // Get referrer's list
      const allRefs = MockStore.getReferrals();
      const myRefs = allRefs.filter((r) => r.referrerId === user.id);
      setReferrals(myRefs);
    }

    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    setLoading(false);
  }, []);

  const handleCopyLink = () => {
    if (!currentUser?.referralCode) return;
    const link = `${origin}/?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Awaiting Appointment</Badge>;
      case "active":
        return <Badge variant="info">Advisory Active</Badge>;
      case "converted":
        return <Badge variant="success">Finalized / Paid</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading referrer stats...</div>;
  }

  if (!currentUser) {
    return <div className="text-center py-10 font-sans text-sm text-slate-400 font-bold">Access Denied...</div>;
  }

  // Earnings calculations
  const totalReferralsCount = referrals.length;
  const activeReferralsCount = referrals.filter((r) => r.status === "active").length;
  const convertedReferralsCount = referrals.filter((r) => r.status === "converted").length;
  const totalEarnings = referrals.reduce((sum, r) => sum + r.rewardAmount, 0);

  return (
    <div className="flex flex-col gap-8 font-sans">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C49A45]">Referral Program</span>
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          Partner Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Invite client portfolios to Ashanti Pension, track their advisory stages, and monitor your 10% net commission payouts.
        </p>
      </div>

      {/* Referral Link Card */}
      <Card className="bg-gradient-to-br from-[#094029] via-[#0C5535] to-[#0A4D3C] text-white">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#C49A45] uppercase tracking-widest">
              My Personal Invitation Link
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Share Ashanti. Earn 10% Commission.
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-sans max-w-sm">
              Your network gets professional advisors and a 50% cashback; you receive a 10% commission share.
            </p>
          </div>

          <div className="w-full sm:w-auto flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-white/10 p-1.5 pl-4 rounded-full border border-white/10">
              <span className="text-xs text-slate-200 font-mono truncate max-w-[200px] sm:max-w-xs">
                {origin}/?ref={currentUser.referralCode}
              </span>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full bg-[#C49A45] hover:bg-[#A37F35] text-white flex items-center justify-center cursor-pointer transition-all flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] font-bold text-[#C49A45] text-center font-sans tracking-wide uppercase">
                Copied Link to Clipboard!
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Referrer Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <Users className="w-8 h-8 text-[#094029] bg-[#ECFAF2] p-1.5 rounded-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold font-serif text-slate-950">{totalReferralsCount}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Referred</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <Hourglass className="w-8 h-8 text-[#A37F35] bg-[#FBF6EC] p-1.5 rounded-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold font-serif text-slate-950">{activeReferralsCount}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Reviews</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <Gift className="w-8 h-8 text-emerald-600 bg-emerald-50 p-1.5 rounded-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold font-serif text-slate-950">{convertedReferralsCount}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Conversions</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <Landmark className="w-8 h-8 text-emerald-600 bg-emerald-50 p-1.5 rounded-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-bold font-serif text-slate-950">
              KES {totalEarnings.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Paid Payouts</span>
          </div>
        </Card>
      </div>

      {/* Referrals List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-serif">Attributed Client Portfolios</CardTitle>
          <UserPlus className="w-4 h-4 text-[#094029]" />
        </CardHeader>
        <CardContent className="p-0">
          {referrals.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 font-sans leading-relaxed">
              No referred clients recorded yet. Share your invitation link to list accounts.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-bold">
                    <th className="p-4 pl-6">Client Name</th>
                    <th className="p-4">Registration Date</th>
                    <th className="p-4">Attribution Stage</th>
                    <th className="p-4 pr-6 text-right">Referral Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-semibold">{ref.clientName}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">{getStatusBadge(ref.status)}</td>
                      <td className="p-4 pr-6 text-right font-serif font-bold text-slate-900">
                        {ref.status === "converted"
                          ? `KES ${ref.rewardAmount.toLocaleString()}`
                          : "Locked"}
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
