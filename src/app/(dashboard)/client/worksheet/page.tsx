"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from "@/components/ui";
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
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading details...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/client")}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <Badge variant={isLocked ? "danger" : isSuccess ? "success" : "gold"}>
          {isLocked ? "Locked" : isSuccess ? "Submitted" : "Awaiting Upload"}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          Upload Pension Worksheet
        </h1>
        <p className="text-sm text-slate-400">
          Provide details about your current pension scheme for review.
        </p>
      </div>

      {isLocked ? (
        <Card className="border-t-4 border-t-rose-500 bg-rose-50/50 shadow-sm p-6 text-center flex flex-col items-center gap-4 py-12">
          <AlertTriangle className="w-12 h-12 text-rose-500 animate-pulse" />
          <h3 className="font-serif font-bold text-lg text-rose-900">Relationship Lock Active</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            CRITICAL RULE: You must officially appoint Ashanti as your agent before you can upload worksheets or request quotations.
          </p>
          <div className="mt-2">
            <Button onClick={() => router.push("/client/appointment")} size="sm">
              Go to Appointment Form
            </Button>
          </div>
        </Card>
      ) : isSuccess ? (
        <Card className="bg-[#ECFAF2] border-2 border-emerald-500/20 text-center py-12 px-6">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-serif font-bold text-xl text-emerald-900">Worksheet Uploaded!</h3>
            <p className="text-sm text-emerald-700 max-w-sm">
              Your pension worksheet and details have been registered in the database. Redirecting to your dashboard...
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Metadata Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pension Scheme Details (Optional)</CardTitle>
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
                  className="w-full px-4 py-3 font-sans text-sm text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:border-[#094029] resize-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Box */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100/80">
              <CardTitle className="text-sm">File Attachment</CardTitle>
              <FileText className="w-4 h-4 text-[#094029]" />
            </CardHeader>
            <CardContent className="pt-6">
              <FileUpload onUpload={handleUploadWorksheet} />
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl">
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
