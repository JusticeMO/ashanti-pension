"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignaturePad } from "@/components/dashboard/SignaturePad";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Alert } from "@/components/ui";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AgentAppointmentPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const user = MockStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const apps = MockStore.getApplications();
      const clientApp = apps.find((a) => a.clientId === user.id);
      if (clientApp) {
        setApp(clientApp);
        // Check if already signed
        if (clientApp.stage !== "profile_complete" && clientApp.stage !== "appointment_pending") {
          setIsSuccess(true);
        }
      }
    }
  }, []);

  const handleSaveSignature = (base64Image: string) => {
    setError(null);

    if (!agreed) {
      setError("Please check the authorization agreement box before submitting your signature.");
      return;
    }

    if (!app) return;

    // Call mock store to appoint agent
    const res = MockStore.appointAgent(app.id, base64Image, "192.168.1.100 (Simulated IP)");
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/client");
      }, 1500);
    } else {
      setError(res.error || "An error occurred while signing the appointment letter.");
    }
  };

  if (!currentUser || !app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading details...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/client")}
          className="inline-flex items-center gap-1.5 text-[#A09890] hover:text-[#094029] text-[0.6875rem] font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Overview
        </button>
        <Badge variant={isSuccess ? "success" : "gold"}>
          {isSuccess ? "Appointed" : "Action Pending"}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1714] leading-tight">
          Agent Appointment Letter
        </h1>
        <p className="text-xs text-[#7A746C] leading-relaxed">
          Complete this document to authorize Ashanti Pension to negotiate on your behalf.
        </p>
      </div>

      {isSuccess ? (
        <Card variant="success" className="text-center py-12 px-6">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-emerald-900 uppercase tracking-wide">Ashanti Appointed Successfully!</h3>
            <p className="text-xs text-emerald-700 max-w-sm">
              The Agent Appointment Letter has been signed and saved to your documents folder. Redirecting you to upload your worksheet...
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Document Content */}
          <Card variant="default">
            <CardHeader className="bg-[#F8F6F3] border-b border-[#EAE7E0]/60 p-6 flex flex-col gap-2 rounded-t-[20px]">
              <div className="flex items-center justify-between text-[0.625rem] text-[#7A746C] font-bold uppercase tracking-widest">
                <span>Ashanti Advisory Services</span>
                <span>Intermediary Doc Ref: #AA-APPT</span>
              </div>
              <div className="text-center py-2 flex flex-col gap-1">
                <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#1A1714] tracking-wider uppercase">
                  Letter of Appointment
                </span>
                <span className="text-[9px] text-[#A09890] font-bold uppercase tracking-widest">Issued pursuant to RBA Pension Guidelines</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 text-xs text-[#4A4540] leading-relaxed flex flex-col gap-6 max-h-96 overflow-y-auto">
              <p>
                <strong>TO:</strong> All Licensed Pension Trustees & Underwriters in Kenya
              </p>
              
              <div>
                <strong>RE: APPOINTMENT OF ASHANTI ADVISORY & REFERRAL PLATFORM AS SOLE INTERMEDIARY OF RECORD</strong>
              </div>

              <p>
                I, the undersigned, hereby appoint <strong>Ashanti Pension Advisory</strong> (hereinafter referred to as "Ashanti") as my authorized agent of record and pension advisor regarding my retirement benefits, scheme evaluations, and retirement account configurations.
              </p>

              <p>
                By signing this document, I grant Ashanti authorization to:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-2">
                <li>
                  Request and compile comparative pension scheme rates, transfer valuations, and quotation matrices from registered insurance providers.
                </li>
                <li>
                  Examine existing pension worksheet statements to extract current values, contribution frameworks, and retirement timelines.
                </li>
                <li>
                  Facilitate negotiations regarding policy terms, guaranteed returns, and rider benefit additions with underwriters.
                </li>
              </ul>

              <p>
                This appointment remains active until revoked by me in writing. I understand that appointing Ashanti does not modify my underlying contributions but establishes Ashanti as the advising broker. This relationship lock is required to release comparative quotations and secure my eligibility for platform cashbacks.
              </p>

              <div className="border-t border-[#EAE7E0]/60 pt-4 flex flex-col gap-2 font-[family-name:var(--font-heading)] text-[10px] font-bold uppercase tracking-wider text-[#7A746C]">
                <div className="flex justify-between">
                  <span>Client Name:</span>
                  <span className="text-[#1A1714]">{currentUser.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="text-[#1A1714]">{new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Client Email:</span>
                  <span className="text-[#1A1714]">{currentUser.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authorization Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-white/60 border border-[#EAE7E0] rounded-[18px] backdrop-blur-[8px]">
            <input
              type="checkbox"
              id="agreed"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-[#C8C2BA] text-[#094029] focus:ring-[#094029]/20 mt-0.5 cursor-pointer accent-[#094029]"
            />
            <label htmlFor="agreed" className="text-xs text-[#7A746C] leading-normal font-medium cursor-pointer select-none">
              I agree to appoint Ashanti as my pension agent and authorize the advisory team to negotiate rates and extract pension statistics on my behalf.
            </label>
          </div>

          {/* Signature Component */}
          <Card variant="flat">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Digital Signature Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <SignaturePad onSave={handleSaveSignature} />
            </CardContent>
          </Card>

          {error && (
            <Alert variant="error" icon={<ShieldCheck className="w-4 h-4" />}>
              {error}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
