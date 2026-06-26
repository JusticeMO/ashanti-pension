"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StatusTimeline } from "@/components/dashboard/StatusTimeline";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
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
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading client data...</div>;
  }

  if (!currentUser || !app) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-12">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h3 className="font-serif font-bold text-xl text-slate-900">Application Record Missing</h3>
        <p className="text-sm text-slate-500 max-w-sm font-sans">
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
                <FileSignature className="w-5 h-5 animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Action Required</span>
              </div>
              <CardTitle>Sign Agent Appointment Letter</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                To initiate the pension review, you must first authorize Ashanti Pension as your broker of record. This lets us legally request quotations from regulated insurance providers.
              </p>
              <div>
                <Link href="/client/appointment">
                  <Button size="sm">Review & Sign Appointment</Button>
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
                <UploadCloud className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Action Required</span>
              </div>
              <CardTitle>Upload Your Pension Worksheet</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                Ashanti is now appointed as your pension agent! To help us analyze your current scheme, please upload your latest pension statement or worksheet.
              </p>
              <div>
                <Link href="/client/worksheet">
                  <Button size="sm">Upload Pension Worksheet</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );

      case "worksheet_review":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Worksheet Under Review</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 font-sans">
              <p className="text-sm text-slate-600 leading-relaxed">
                Your uploaded pension worksheet is being evaluated by your assigned advisor. Once verified, we will request quotation options.
              </p>
              <div className="flex gap-2 items-center text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C49A45] animate-ping" />
                <span>Advisor Status: Verifying Current Values</span>
              </div>
            </CardContent>
          </Card>
        );

      case "quotes_preparing":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Acquiring Comparative Quotes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 font-sans">
              <p className="text-sm text-slate-600 leading-relaxed">
                Your advisor is currently requesting comparative terms and rates from ICEA LION, Britam, Jubilee, and other top-tier providers.
              </p>
              <div className="flex gap-2 items-center text-xs font-bold text-[#094029] bg-[#ECFAF2] p-3 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-[#094029] animate-pulse" />
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
                <FileStack className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Action Required</span>
              </div>
              <CardTitle>Compare Advisory Options</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                Your advisor has compiled comparative pension offers. Review the benefits, expected returns, and terms to select your ideal plan.
              </p>
              <div>
                <Link href="/client/quotes">
                  <Button size="sm">Compare & Select Option</Button>
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
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Status</span>
              </div>
              <CardTitle>Preparing Policy Package</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 font-sans">
              <p className="text-sm text-slate-600 leading-relaxed">
                Thank you for choosing your pension product. Our advisors are compiling your official policy documents with the insurer.
              </p>
              <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl">
                We'll notify you when the policy is complete and your cashback is disbursed.
              </div>
            </CardContent>
          </Card>
        );

      case "completed":
        return (
          <Card className="bg-[#ECFAF2] border-2 border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#094029] mb-1">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Complete</span>
              </div>
              <CardTitle className="text-emerald-900">Pension Advisory Complete</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 font-sans">
              <p className="text-sm text-emerald-800 leading-relaxed">
                Congratulations! Your new pension policy is officially activated. Ashanti commission shares and cashback calculations have been processed.
              </p>
              <div className="text-xs font-bold text-[#094029] bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span>Total Cashback Payout:</span>
                <span className="text-sm font-serif">50% Net Agent Commission</span>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 font-sans items-start">
      {/* Left panel: welcome & action widgets */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C49A45]">Welcome Back</span>
          <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
            {currentUser.fullName}
          </h1>
          <p className="text-sm text-slate-500">
            Monitor and complete actions in your retirement advisory timeline.
          </p>
        </div>

        {renderActionBlock()}

        {/* General Guidelines for Client */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm">Platform Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-xs leading-relaxed text-slate-500 font-sans">
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C49A45] mt-1.5 flex-shrink-0" />
              <p>
                <strong>Relationship Lock:</strong> Ashanti cannot request quotes until you appoint us as agent. This secures your access to cashback.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C49A45] mt-1.5 flex-shrink-0" />
              <p>
                <strong>Commission Payouts:</strong> Ashanti passes 50% of the net commission received back to the client directly.
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
