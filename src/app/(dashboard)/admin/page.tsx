"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile, Commission } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
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
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading admin ledger...</div>;
  }

  // Summary Metrics
  const totalUsers = profiles.length;
  const totalActiveApps = apps.filter((a) => a.stage !== "completed").length;
  const totalPremium = commissions.reduce((sum, c) => sum + c.premium, 0);
  const totalGrossCom = commissions.reduce((sum, c) => sum + c.grossCommission, 0);

  return (
    <div className="flex flex-col gap-8 font-sans">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C49A45]">System Administration</span>
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          System Overview
        </h1>
        <p className="text-sm text-slate-400">
          Manage operational pipelines, review CRM workloads, and audit financial commission ledger matrices.
        </p>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <Users className="w-8 h-8 text-[#094029] bg-[#ECFAF2] p-1.5 rounded-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold font-serif text-slate-950">{totalUsers}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registered Accounts</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <FileStack className="w-8 h-8 text-[#A37F35] bg-[#FBF6EC] p-1.5 rounded-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold font-serif text-slate-950">{totalActiveApps}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Pipelines</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <Percent className="w-8 h-8 text-[#094029] bg-[#ECFAF2] p-1.5 rounded-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold font-serif text-slate-950">
              KES {totalPremium.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premium Volume</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <Award className="w-8 h-8 text-emerald-600 bg-emerald-50 p-1.5 rounded-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold font-serif text-slate-950">
              KES {totalGrossCom.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Commissions</span>
          </div>
        </Card>
      </div>

      {/* Global Applications Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-serif">Global Advisory Applications</CardTitle>
          <BarChart3 className="w-4 h-4 text-[#094029]" />
        </CardHeader>
        <CardContent className="p-0">
          {apps.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No advisory applications registered in database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-bold">
                    <th className="p-4 pl-6">Client Name</th>
                    <th className="p-4">Assigned Advisor</th>
                    <th className="p-4">Referrer Attribution</th>
                    <th className="p-4">Updated Date</th>
                    <th className="p-4 pr-6">Workflow Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {apps.map((appItem) => (
                    <tr key={appItem.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-semibold">{getClientName(appItem.clientId)}</td>
                      <td className="p-4">{getAdvisorName(appItem.assignedAdvisorId)}</td>
                      <td className="p-4">{getReferrerName(appItem.referrerId)}</td>
                      <td className="p-4 text-slate-400">
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
