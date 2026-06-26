"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile, Commission } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Badge, SectionHeader, StatCard } from "@/components/ui";
import { Users, FileStack, Percent, Award, ShieldAlert, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApps(MockStore.getApplications());
    setProfiles(MockStore.getProfiles());
    setCommissions(MockStore.getCommissions());
    setLoading(false);
  }, []);

  const getClientName = (clientId: string) => {
    return profiles.find((p) => p.id === clientId)?.fullName || "Unknown Client";
  };

  const getAdvisorName = (advisorId?: string) => {
    if (!advisorId) return "Unassigned";
    return profiles.find((p) => p.id === advisorId)?.fullName || "David Ochieng";
  };

  const getReferrerName = (referrerId?: string) => {
    if (!referrerId) return "Direct / None";
    return profiles.find((p) => p.id === referrerId)?.fullName || "Grace Mutua";
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "profile_complete":
      case "appointment_pending":
        return "danger";
      case "appointment_completed":
      case "worksheet_review":
        return "gold";
      case "quotes_preparing":
      case "options_ready":
        return "info";
      case "product_selected":
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const getStageLabel = (stage: string) => {
    return stage.replace(/_/g, " ").toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading admin ledger...</span>
      </div>
    );
  }

  // Summary Metrics
  const totalUsers = profiles.length;
  const totalActiveApps = apps.filter((a) => a.stage !== "completed").length;
  const totalPremium = commissions.reduce((sum, c) => sum + c.premium, 0);
  const totalGrossCom = commissions.reduce((sum, c) => sum + c.grossCommission, 0);

  return (
    <div className="flex flex-col gap-8 font-[family-name:var(--font-body)]">
      <SectionHeader
        overline="System Administration"
        title="System Overview"
        subtitle="Manage operational pipelines, review CRM workloads, and audit financial commission ledger matrices."
      />

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5 text-[#094029]" />}
          iconBg="bg-[#ECFAF2]"
          value={totalUsers}
          label="Registered Accounts"
        />
        <StatCard
          icon={<FileStack className="w-5 h-5 text-[#8A6A25]" />}
          iconBg="bg-[#FBF8F0]"
          value={totalActiveApps}
          label="Active Pipelines"
        />
        <StatCard
          icon={<Percent className="w-5 h-5 text-[#094029]" />}
          iconBg="bg-[#ECFAF2]"
          value={`KES ${totalPremium.toLocaleString()}`}
          label="Premium Volume"
        />
        <StatCard
          icon={<Award className="w-5 h-5 text-emerald-700" />}
          iconBg="bg-emerald-50"
          value={`KES ${totalGrossCom.toLocaleString()}`}
          label="Gross Commission"
        />
      </div>

      {/* Global Applications Table */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#EAE7E0]/60">
          <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Global Advisory Applications</CardTitle>
          <BarChart3 className="w-4 h-4 text-[#094029]" />
        </CardHeader>
        <CardContent className="p-0">
          {apps.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#A09890]">
              No advisory applications registered in database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F6F3] text-[#7A746C] border-b border-[#EAE7E0]/60 uppercase tracking-widest font-bold font-[family-name:var(--font-heading)]">
                    <th className="p-4 pl-6">Client Name</th>
                    <th className="p-4">Assigned Advisor</th>
                    <th className="p-4">Referrer Attribution</th>
                    <th className="p-4">Updated Date</th>
                    <th className="p-4 pr-6">Workflow Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE7E0]/40 font-medium text-[#4A4540]">
                  {apps.map((appItem) => (
                    <tr key={appItem.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4 pl-6 font-bold text-[#1A1714] font-[family-name:var(--font-heading)] uppercase tracking-wider">{getClientName(appItem.clientId)}</td>
                      <td className="p-4">{getAdvisorName(appItem.assignedAdvisorId)}</td>
                      <td className="p-4">{getReferrerName(appItem.referrerId)}</td>
                      <td className="p-4 text-[#A09890]">
                        {new Date(appItem.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 pr-6">
                        <Badge variant={getStageColor(appItem.stage)}>
                          {getStageLabel(appItem.stage)}
                        </Badge>
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
