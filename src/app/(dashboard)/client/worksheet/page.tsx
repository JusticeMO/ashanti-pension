"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge, Alert } from "@/components/ui";
import { ArrowLeft, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function WorksheetUploadPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [prevProvider, setPrevProvider] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = MockStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const apps = MockStore.getApplications();
      const clientApp = apps.find((a) => a.clientId === user.id);
      if (clientApp) {
        setApp(clientApp);
        // GATE CHECK: Check if Ashanti is appointed
        if (
          clientApp.stage !== "profile_complete" &&
          clientApp.stage !== "appointment_pending"
        ) {
          setIsLocked(false);
        }
      }
    }
  }, []);

  const handleUploadWorksheet = (fileName: string) => {
    if (!app) return;
    setError(null);

    const numericValue = prevValue ? parseFloat(prevValue) : undefined;
    const res = MockStore.uploadWorksheet(app.id, fileName, {
      prevProvider: prevProvider || undefined,
      prevValue: numericValue,
      note: note || undefined,
    });

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/client");
      }, 1500);
    } else {
      setError(res.error || "Failed to submit worksheet details");
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
    <div className="flex flex-col gap-6 max-w-2xl mx-auto font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/client")}
          className="inline-flex items-center gap-1.5 text-[#A09890] hover:text-[#094029] text-[0.6875rem] font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Overview
        </button>
        <Badge variant={isLocked ? "danger" : isSuccess ? "success" : "gold"}>
          {isLocked ? "Locked" : isSuccess ? "Submitted" : "Awaiting Upload"}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1714] leading-tight">
          Upload Pension Worksheet
        </h1>
        <p className="text-xs text-[#7A746C] leading-relaxed">
          Provide details about your current pension scheme for review.
        </p>
      </div>

      {isLocked ? (
        <Card variant="danger" className="text-center flex flex-col items-center gap-4 py-12 px-6">
          <AlertTriangle className="w-12 h-12 text-[#B91C1C] animate-pulse" />
          <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-[#7F1D1D] uppercase tracking-wider">Relationship Lock Active</h3>
          <p className="text-xs text-[#7F1D1D]/90 max-w-sm leading-relaxed">
            CRITICAL RULE: You must officially appoint Ashanti as your agent before you can upload worksheets or request quotations.
          </p>
          <div className="mt-2">
            <Button onClick={() => router.push("/client/appointment")} variant="danger" size="sm">
              Go to Appointment Form
            </Button>
          </div>
        </Card>
      ) : isSuccess ? (
        <Card variant="success" className="text-center py-12 px-6">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-emerald-900 uppercase tracking-wide">Worksheet Uploaded!</h3>
            <p className="text-xs text-emerald-700 max-w-sm">
              Your pension worksheet and details have been registered in the database. Redirecting to your dashboard...
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Metadata Form */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Pension Scheme Details (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Current Insurer/Provider</Label>
                  <Input
                    id="provider"
                    type="text"
                    placeholder="e.g. ICEA LION"
                    value={prevProvider}
                    onChange={(e) => setPrevProvider(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Current Valuation (KES)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="e.g. 500000"
                    value={prevValue}
                    onChange={(e) => setPrevValue(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="note">Message to Advisor</Label>
                <textarea
                  id="note"
                  rows={3}
                  placeholder="Explain any details about your fund transfer..."
                  className="w-full px-4 py-[13px] font-[family-name:var(--font-body)] text-[0.9375rem] text-[#1A1714] bg-white/90 border-[1.5px] border-[#C8C2BA] focus:border-[#0F6B42] focus:bg-white rounded-[14px] outline-none transition-all duration-150 backdrop-blur-[8px] focus:shadow-[0_0_0_4px_rgba(9,64,41,0.09)] resize-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Box */}
          <Card variant="flat">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#EAE7E0]/60">
              <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">File Attachment</CardTitle>
              <FileText className="w-4 h-4 text-[#094029]" />
            </CardHeader>
            <CardContent className="pt-6">
              <FileUpload onUpload={handleUploadWorksheet} />
            </CardContent>
          </Card>

          {error && (
            <Alert variant="error" icon={<AlertTriangle className="w-4 h-4" />}>
              {error}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
