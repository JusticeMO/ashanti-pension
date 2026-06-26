"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StatusTimeline } from "@/components/dashboard/StatusTimeline";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, SectionHeader } from "@/components/ui";
import { FileSignature, UploadCloud, FileStack, ShieldCheck, HeartHandshake, AlertCircle } from "lucide-react";

export default function ClientDashboard() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = MockStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const apps = MockStore.getApplications();
      const clientApp = apps.find((a) => a.clientId === user.id);
      if (clientApp) {
        setApp(clientApp);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading client data...</span>
      </div>
    );
  }

  if (!currentUser || !app) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-20 font-[family-name:var(--font-body)]">
        <div className="p-3 bg-red-50 border border-red-100 rounded-full text-[#B91C1C]">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="font-[family-name:var(--font-heading)] font-extrabold text-xl text-[#1A1714]">Application Record Missing</h3>
        <p className="text-xs text-[#7A746C] max-w-xs leading-relaxed">
          Could not find an active advisory application for your account. Please contact advisory support.
        </p>
      </div>
    );
  }

  // Generate contextual action block based on stage
  const renderActionBlock = () => {
    switch (app.stage) {
      case "profile_complete":
      case "appointment_pending":
        return (
          <Card variant="gold">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#C49A45] mb-1">
                <FileSignature className="w-4 h-4" />
                <span className="text-[0.625rem] font-bold uppercase tracking-wider font-[family-name:var(--font-heading)]">Action Required</span>
              </div>
              <CardTitle>Sign Agent Appointment Letter</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-xs text-[#7A746C] leading-relaxed">
                To initiate the pension review, you must first authorize Ashanti Pension as your broker of record. This lets us legally request quotations from regulated insurance providers.
              </p>
              <div>
                <Link href="/client/appointment">
                  <Button variant="primary" size="sm">Review & Sign Appointment</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );

      case "appointment_completed":
        return (
          <Card variant="green">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#094029] mb-1">
                <UploadCloud className="w-4 h-4" />
                <span className="text-[0.625rem] font-bold uppercase tracking-wider font-[family-name:var(--font-heading)]">Action Required</span>
              </div>
              <CardTitle>Upload Your Pension Worksheet</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-xs text-[#7A746C] leading-relaxed">
                Ashanti is now appointed as your pension agent! To help us analyze your current scheme, please upload your latest pension statement or worksheet.
              </p>
              <div>
                <Link href="/client/worksheet">
                  <Button variant="secondary" size="sm">Upload Pension Worksheet</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );

      case "worksheet_review":
        return (
          <Card variant="default">
            <CardHeader>
              <CardTitle>Worksheet Under Review</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-[#7A746C] leading-relaxed">
                Your uploaded pension worksheet is being evaluated by your assigned advisor. Once verified, we will request quotation options.
              </p>
              <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-wider text-[#8A6A25] bg-[#FBF8F0] p-3 rounded-xl border border-[rgba(196,154,69,0.22)]">
                <div className="w-2 h-2 rounded-full bg-[#C49A45] animate-ping" />
                <span>Advisor Status: Verifying Current Values</span>
              </div>
            </CardContent>
          </Card>
        );

      case "quotes_preparing":
        return (
          <Card variant="default">
            <CardHeader>
              <CardTitle>Acquiring Comparative Quotes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-[#7A746C] leading-relaxed">
                Your advisor is currently requesting comparative terms and rates from ICEA LION, Britam, Jubilee, and other top-tier providers.
              </p>
              <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-wider text-[#094029] bg-[#ECFAF2] p-3 rounded-xl border border-[rgba(9,64,41,0.15)]">
                <div className="w-2 h-2 rounded-full bg-[#094029] animate-pulse" />
                <span>Advisor Status: Underwriter Negotiations Active</span>
              </div>
            </CardContent>
          </Card>
        );

      case "options_ready":
        return (
          <Card variant="gold">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#C49A45] mb-1">
                <FileStack className="w-4 h-4" />
                <span className="text-[0.625rem] font-bold uppercase tracking-wider font-[family-name:var(--font-heading)]">Action Required</span>
              </div>
              <CardTitle>Compare Advisory Options</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-xs text-[#7A746C] leading-relaxed">
                Your advisor has compiled comparative pension offers. Review the benefits, expected returns, and terms to select your ideal plan.
              </p>
              <div>
                <Link href="/client/quotes">
                  <Button variant="primary" size="sm">Compare & Select Option</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );

      case "product_selected":
        return (
          <Card variant="green">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#094029] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[0.625rem] font-bold uppercase tracking-wider font-[family-name:var(--font-heading)]">Status</span>
              </div>
              <CardTitle>Preparing Policy Package</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-[#7A746C] leading-relaxed">
                Thank you for choosing your pension product. Our advisors are compiling your official policy documents with the insurer.
              </p>
              <div className="text-[10px] font-semibold text-[#A09890] bg-[#F8F6F3] p-3 rounded-xl border border-[#EAE7E0] uppercase tracking-wider text-center">
                We'll notify you when the policy is complete and your cashback is disbursed.
              </div>
            </CardContent>
          </Card>
        );

      case "completed":
        return (
          <Card variant="success">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#094029] mb-1">
                <HeartHandshake className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-[0.625rem] font-bold uppercase tracking-wider font-[family-name:var(--font-heading)]">Complete</span>
              </div>
              <CardTitle className="text-emerald-900">Pension Advisory Complete</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-emerald-800 leading-relaxed">
                Congratulations! Your new pension policy is officially activated. Ashanti commission shares and cashback calculations have been processed.
              </p>
              <div className="text-[11px] font-bold text-[#094029] bg-white/80 backdrop-blur-sm p-3.5 rounded-xl border border-emerald-200/50 flex items-center justify-between uppercase tracking-wider font-[family-name:var(--font-heading)]">
                <span>Total Cashback Payout:</span>
                <span className="text-xs font-extrabold text-[#C49A45] bg-[#094029] px-2.5 py-0.5 rounded-full">50% Net Commission</span>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 font-[family-name:var(--font-body)] items-start">
      {/* Left panel: welcome & action widgets */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        <SectionHeader
          overline="Welcome Back"
          title={currentUser.fullName}
          subtitle="Monitor and complete actions in your retirement advisory timeline."
        />

        {renderActionBlock()}

        {/* General Guidelines for Client */}
        <Card variant="flat">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Platform Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-xs leading-relaxed text-[#7A746C]">
            <div className="flex gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C49A45] mt-1.5 flex-shrink-0" />
              <p>
                <strong className="text-[#1A1714]">Relationship Lock:</strong> Ashanti cannot request quotes until you appoint us as agent. This secures your access to cashback.
              </p>
            </div>
            <div className="flex gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C49A45] mt-1.5 flex-shrink-0" />
              <p>
                <strong className="text-[#1A1714]">Commission Payouts:</strong> Ashanti passes 50% of the net commission received back to the client directly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right panel: Timeline */}
      <div className="lg:col-span-5">
        <StatusTimeline currentStage={app.stage} />
      </div>
    </div>
  );
}
