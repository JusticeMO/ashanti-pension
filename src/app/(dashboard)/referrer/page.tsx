"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { Referral, Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, SectionHeader, StatCard } from "@/components/ui";
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
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading stats...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <div className="text-center py-10 font-[family-name:var(--font-body)] text-xs text-[#A09890] font-bold uppercase tracking-wider">Access Denied...</div>;
  }

  // Earnings calculations
  const totalReferralsCount = referrals.length;
  const activeReferralsCount = referrals.filter((r) => r.status === "active").length;
  const convertedReferralsCount = referrals.filter((r) => r.status === "converted").length;
  const totalEarnings = referrals.reduce((sum, r) => sum + r.rewardAmount, 0);

  return (
    <div className="flex flex-col gap-8 font-[family-name:var(--font-body)]">
      <SectionHeader
        overline="Referral Program"
        title="Partner Dashboard"
        subtitle="Invite client portfolios to Ashanti Pension, track their advisory stages, and monitor your 10% net commission payouts."
      />

      {/* Referral Link Card */}
      <Card variant="hero" className="text-white relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#C49A45]/[0.08] blur-[80px]" />
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <span className="text-[0.625rem] font-bold text-[#D4AF5F] uppercase tracking-[0.15em] font-[family-name:var(--font-heading)]">
              Personal Invitation Link
            </span>
            <h3 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
              Share Ashanti. Earn 10% Commission.
            </h3>
            <p className="text-xs text-[#E0DBD5] leading-relaxed max-w-sm">
              Your network gets professional advisors and a 50% cashback; you receive a 10% commission share.
            </p>
          </div>

          <div className="w-full sm:w-auto flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-white/10 p-1.5 pl-4 rounded-full border border-white/10 max-w-full">
              <span className="text-[11px] text-slate-200 font-mono truncate max-w-[200px] sm:max-w-[240px]">
                {origin}/?ref={currentUser.referralCode}
              </span>
              <button
                onClick={handleCopyLink}
                className="w-9 h-9 rounded-full bg-[#C49A45] hover:bg-[#D4AF5F] text-white flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] font-bold text-[#C49A45] text-center font-[family-name:var(--font-heading)] tracking-wider uppercase">
                Copied Link to Clipboard!
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Referrer Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5 text-[#094029]" />}
          iconBg="bg-[#ECFAF2]"
          value={totalReferralsCount}
          label="Total Referred"
        />
        <StatCard
          icon={<Hourglass className="w-5 h-5 text-[#8A6A25]" />}
          iconBg="bg-[#FBF8F0]"
          value={activeReferralsCount}
          label="Active Reviews"
        />
        <StatCard
          icon={<Gift className="w-5 h-5 text-emerald-700" />}
          iconBg="bg-emerald-50"
          value={convertedReferralsCount}
          label="Conversions"
        />
        <StatCard
          icon={<Landmark className="w-5 h-5 text-emerald-700" />}
          iconBg="bg-emerald-50"
          value={`KES ${totalEarnings.toLocaleString()}`}
          label="Total Payouts"
        />
      </div>

      {/* Referrals List */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#EAE7E0]/60">
          <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Attributed Client Portfolios</CardTitle>
          <UserPlus className="w-4 h-4 text-[#094029]" />
        </CardHeader>
        <CardContent className="p-0">
          {referrals.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#A09890] leading-relaxed">
              No referred clients recorded yet. Share your invitation link to list accounts.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F6F3] text-[#7A746C] border-b border-[#EAE7E0]/60 uppercase tracking-widest font-bold font-[family-name:var(--font-heading)]">
                    <th className="p-4 pl-6">Client Name</th>
                    <th className="p-4">Registration Date</th>
                    <th className="p-4">Attribution Stage</th>
                    <th className="p-4 pr-6 text-right">Referral Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE7E0]/40 font-medium text-[#4A4540]">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4 pl-6 font-bold text-[#1A1714] font-[family-name:var(--font-heading)] uppercase tracking-wider">{ref.clientName}</td>
                      <td className="p-4 text-[#A09890]">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">{getStatusBadge(ref.status)}</td>
                      <td className="p-4 pr-6 text-right font-bold text-[#1A1714]">
                        {ref.status === "converted"
                          ? `KES ${ref.rewardAmount.toLocaleString()}`
                          : <span className="text-[#A09890] uppercase tracking-wider text-[10px]">Locked</span>}
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
