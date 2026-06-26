"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile, Quote, ApplicationStage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, SectionHeader, StatCard } from "@/components/ui";
import {
  Users,
  ChevronRight,
  TrendingUp,
  FileSignature,
  FileSearch,
  Hourglass,
  CheckSquare,
  Lock,
  ChevronDown,
  Building,
} from "lucide-react";

export default function AdvisorDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [advancingStage, setAdvancingStage] = useState(false);

  const loadData = () => {
    const user = MockStore.getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      const allApps = MockStore.getApplications();
      // Filter for advisor assignments
      const advisorApps = allApps.filter((a) => a.assignedAdvisorId === user.id);
      setApps(advisorApps);

      setProfiles(MockStore.getProfiles());
      setQuotes(MockStore.getQuotes());
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getClientName = (clientId: string) => {
    return profiles.find((p) => p.id === clientId)?.fullName || "Unknown Client";
  };

  const getClientEmail = (clientId: string) => {
    return profiles.find((p) => p.id === clientId)?.email || "";
  };

  const getReferrerName = (referrerId?: string) => {
    if (!referrerId) return "Direct / None";
    return profiles.find((p) => p.id === referrerId)?.fullName || "Grace Mutua";
  };

  const handleAdvance = (appId: string, currentStage: string) => {
    let nextStage: ApplicationStage = "profile_complete";
    if (currentStage === "profile_complete" || currentStage === "appointment_pending") {
      // Gate check: has to be appointed first
      const appointments = MockStore.getAppointments();
      const hasSigned = appointments.some((a) => a.applicationId === appId);
      if (!hasSigned) {
        alert("CRITICAL GATING RULE: The client must sign the Ashanti Agent Appointment letter before advisory or worksheet review can proceed.");
        return;
      }
      nextStage = "appointment_completed";
    } else if (currentStage === "appointment_completed") {
      nextStage = "worksheet_review";
    } else if (currentStage === "worksheet_review") {
      nextStage = "quotes_preparing";
    } else if (currentStage === "quotes_preparing") {
      // Must have quotes added
      const appQuotes = quotes.filter((q) => q.applicationId === appId);
      if (appQuotes.length === 0) {
        alert("Please add at least one quotation request for this client first.");
        return;
      }
      // Check if quotes are received/presented
      const hasPresented = appQuotes.some((q) => q.status === "presented" || q.status === "received");
      if (!hasPresented) {
        alert("Please mark at least one quote as presented to client before changing stage.");
        return;
      }
      nextStage = "options_ready";
    } else if (currentStage === "options_ready") {
      // client selects quote (usually client action, but allow advisor override for prototype)
      const selected = quotes.find((q) => q.applicationId === appId && q.status === "selected");
      if (!selected) {
        alert("Client must choose their preferred plan first.");
        return;
      }
      nextStage = "product_selected";
    } else if (currentStage === "product_selected") {
      // admin processes commission ledger and locks it
      alert("Commissions ledger approval is handled by Admins.");
      return;
    }

    setAdvancingStage(true);
    setTimeout(() => {
      const res = MockStore.advanceStage(appId, nextStage);
      setAdvancingStage(false);
      if (res.success) {
        loadData();
      } else {
        alert(res.error || "Failed to update stage");
      }
    }, 400);
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
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading pipeline...</span>
      </div>
    );
  }

  // Group applications for pipeline columns
  const columnStages = [
    { title: "Appointment Pending", stages: ["profile_complete", "appointment_pending"] },
    { title: "Worksheet & Review", stages: ["appointment_completed", "worksheet_review"] },
    { title: "Quotation Preparations", stages: ["quotes_preparing", "options_ready"] },
    { title: "Selected & Complete", stages: ["product_selected", "completed"] },
  ];

  return (
    <div className="flex flex-col gap-8 font-[family-name:var(--font-body)]">
      <SectionHeader
        overline="Advisor Workspace"
        title="Client Advisory Pipeline"
        subtitle="Track agent appointments, review worksheets, compile underwriter bids, and manage conversions."
      />

      {/* CRM Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5 text-[#094029]" />}
          iconBg="bg-[#ECFAF2]"
          value={apps.length}
          label="Clients Assigned"
        />
        <StatCard
          icon={<FileSignature className="w-5 h-5 text-[#8A6A25]" />}
          iconBg="bg-[#FBF8F0]"
          value={apps.filter((a) => a.stage === "profile_complete" || a.stage === "appointment_pending").length}
          label="Awaiting Appt"
        />
        <StatCard
          icon={<Hourglass className="w-5 h-5 text-[#094029]" />}
          iconBg="bg-[#ECFAF2]"
          value={apps.filter((a) => a.stage === "quotes_preparing" || a.stage === "options_ready").length}
          label="Quote Evaluations"
        />
        <StatCard
          icon={<CheckSquare className="w-5 h-5 text-emerald-700" />}
          iconBg="bg-emerald-50"
          value={apps.filter((a) => a.stage === "completed").length}
          label="Conversions"
        />
      </div>

      {/* CRM Columns View */}
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {columnStages.map((col, cIdx) => {
          const colApps = apps.filter((a) => col.stages.includes(a.stage));

          return (
            <div key={cIdx} className="flex flex-col gap-4 min-w-0">
              <div className="flex items-center justify-between border-b border-[#EAE7E0]/60 pb-2">
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-xs uppercase tracking-wider text-[#4A4540] truncate pr-2">{col.title}</h3>
                <Badge variant={colApps.length > 0 ? "gold" : "default"}>
                  {colApps.length}
                </Badge>
              </div>

              {colApps.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-[#C8C2BA] text-[10px] font-bold uppercase tracking-wider text-[#A09890] rounded-[20px] bg-white/40 select-none">
                  Empty State
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {colApps.map((appItem) => {
                    const hasAppointed =
                      appItem.stage !== "profile_complete" &&
                      appItem.stage !== "appointment_pending";
                    const isSelected = selectedAppId === appItem.id;

                    const clientQuotes = quotes.filter((q) => q.applicationId === appItem.id);

                    return (
                      <Card
                        key={appItem.id}
                        variant={isSelected ? "gold" : "default"}
                        className="cursor-pointer"
                        onClick={() => setSelectedAppId(isSelected ? null : appItem.id)}
                      >
                        <CardContent className="p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-[#1A1714] font-[family-name:var(--font-heading)] uppercase tracking-wider truncate">
                              {getClientName(appItem.clientId)}
                            </span>
                            <Badge variant={getStageColor(appItem.stage)} className="flex-shrink-0">
                              {getStageLabel(appItem.stage).split(" ").slice(0, 2).join(" ")}
                            </Badge>
                          </div>

                          <div className="flex flex-col text-[10px] text-[#7A746C] gap-1">
                            <span className="truncate">{getClientEmail(appItem.clientId)}</span>
                            <span>Attribution: <strong className="text-[#094029] uppercase">{getReferrerName(appItem.referrerId)}</strong></span>
                          </div>

                          {/* Gating lock alert badge */}
                          {!hasAppointed && (
                            <div className="inline-flex items-center gap-1.5 text-[9px] bg-red-50 text-[#B91C1C] font-bold p-1 px-2.5 rounded-lg border border-red-100 mt-1 w-fit uppercase tracking-wider">
                              <Lock className="w-3 h-3 text-[#B91C1C]" />
                              Advisory locked
                            </div>
                          )}

                          {isSelected && (
                            <div className="flex flex-col gap-2.5 pt-3.5 border-t border-[#EAE7E0]/60 mt-2 animate-fade-in">
                              <div className="text-[10px] text-[#7A746C] flex flex-col gap-1.5 bg-[#F8F6F3] p-2.5 rounded-xl border border-[#EAE7E0]/80">
                                <div>
                                  <strong>Full Stage:</strong> {getStageLabel(appItem.stage)}
                                </div>
                                {clientQuotes.length > 0 && (
                                  <div>
                                    <strong>Quotes Added:</strong> {clientQuotes.length} ({clientQuotes.map((q) => q.provider).join(", ")})
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col gap-2">
                                {hasAppointed ? (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/advisor/quotes/new?app=${appItem.id}`);
                                    }}
                                    size="sm"
                                    variant="outline-green"
                                    className="w-full text-[10px]"
                                  >
                                    Add Quotation
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      alert("Client must complete their Ashanti Agent Appointment signature from their portal first.");
                                    }}
                                    size="sm"
                                    variant="ghost"
                                    disabled
                                    className="w-full text-[10px]"
                                  >
                                    Quotation Sourcing Locked
                                  </Button>
                                )}

                                {appItem.stage !== "completed" && appItem.stage !== "product_selected" && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAdvance(appItem.id, appItem.stage);
                                    }}
                                    size="sm"
                                    variant="primary"
                                    className="w-full text-[10px]"
                                    isLoading={advancingStage}
                                  >
                                    Advance Stage
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
