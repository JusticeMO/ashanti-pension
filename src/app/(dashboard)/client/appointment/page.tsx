"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignaturePad } from "@/components/dashboard/SignaturePad";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ShieldCheck, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";

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
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading details...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/client")}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <Badge variant={isSuccess ? "success" : "gold"}>
          {isSuccess ? "Appointed" : "Action Pending"}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          Agent Appointment Letter
        </h1>
        <p className="text-sm text-slate-400">
          Complete this document to authorize Ashanti Pension to negotiate on your behalf.
        </p>
      </div>

      {isSuccess ? (
        <Card className="bg-[#ECFAF2] border-2 border-emerald-500/20 text-center py-12 px-6">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif font-bold text-xl text-emerald-900">Ashanti Appointed Successfully!</h3>
            <p className="text-sm text-emerald-700 max-w-sm">
              The Agent Appointment Letter has been signed and saved to your documents folder. Redirecting you to upload your worksheet...
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Document Content */}
          <Card className="shadow-md bg-white border border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-200/60 p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>Ashanti Advisory Services</span>
                <span>Intermediary Doc Ref: #AA-APPT</span>
              </div>
              <div className="text-center py-2 flex flex-col gap-1">
                <span className="font-serif text-base font-bold text-slate-800 tracking-wide uppercase">
                  Letter of Appointment
                </span>
                <span className="text-[10px] text-slate-400">Issued pursuant to RBA Pension Guidelines</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans flex flex-col gap-6 max-h-96 overflow-y-auto">
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

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800">Client Name:</span>
                  <span>{currentUser.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800">Date:</span>
                  <span>{new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800">Client Email:</span>
                  <span>{currentUser.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authorization Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <input
              type="checkbox"
              id="agreed"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-[#094029] focus:ring-[#094029]/20 mt-0.5 cursor-pointer"
            />
            <label htmlFor="agreed" className="text-xs sm:text-sm text-slate-600 leading-normal font-medium cursor-pointer select-none">
              I agree to appoint Ashanti as my pension agent and authorize the advisory team to negotiate rates and extract pension statistics on my behalf.
            </label>
          </div>

          {/* Signature Component */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Digital Signature Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <SignaturePad onSave={handleSaveSignature} />
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
