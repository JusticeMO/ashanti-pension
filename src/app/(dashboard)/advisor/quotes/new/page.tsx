"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MockStore } from "@/lib/mockStore";
import { Profile, Application, InsuranceProvider } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select, Alert } from "@/components/ui";
import { ArrowLeft, CheckCircle, ShieldAlert, Building } from "lucide-react";

function QuoteRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);

  // Form Fields
  const [selectedAppId, setSelectedAppId] = useState("");
  const [provider, setProvider] = useState("");
  const [productType, setProductType] = useState("Personal Pension Plan");
  const [productName, setProductName] = useState("");
  const [premium, setPremium] = useState("");
  const [returns, setReturns] = useState("");
  const [benefits, setBenefits] = useState("");
  const [terms, setTerms] = useState("");

  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const user = MockStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      setProviders(MockStore.getProviders());
      setProfiles(MockStore.getProfiles());

      const allApps = MockStore.getApplications();
      const advisorApps = allApps.filter((a) => a.assignedAdvisorId === user.id);
      setApps(advisorApps);

      // Read query param if active
      const appParam = searchParams.get("app");
      if (appParam) {
        setSelectedAppId(appParam);
      } else if (advisorApps.length > 0) {
        setSelectedAppId(advisorApps[0].id);
      }
    }
  }, [searchParams]);

  // Hook gate validation whenever selected app changes
  useEffect(() => {
    if (selectedAppId) {
      const app = apps.find((a) => a.id === selectedAppId);
      if (app) {
        const appointments = MockStore.getAppointments();
        const hasSigned = appointments.some((apt) => apt.applicationId === selectedAppId);
        if (!hasSigned) {
          setIsLocked(true);
        } else {
          setIsLocked(false);
        }
      }
    }
  }, [selectedAppId, apps]);

  const getClientName = (clientId: string) => {
    return profiles.find((p) => p.id === clientId)?.fullName || "Unknown Client";
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAppId || !provider || !productName || !premium || !returns) {
      setError("Please fill in all required statistical fields.");
      return;
    }

    if (isLocked) {
      setError("CRITICAL RELATIONSHIP LOCK: Appointing Ashanti is required before sourcing quotes.");
      return;
    }

    const premiumNum = parseFloat(premium);
    const returnsNum = parseFloat(returns);
    const benefitsList = benefits.split("\n").filter((b) => b.trim() !== "");

    if (isNaN(premiumNum) || isNaN(returnsNum)) {
      setError("Please enter valid numeric figures for Premium and Returns.");
      return;
    }

    // Submit Quote Request
    const res = MockStore.createQuoteRequest({
      applicationId: selectedAppId,
      provider,
      productType,
      productName,
      premium: premiumNum,
      benefits: benefitsList.length > 0 ? benefitsList : ["Comprehensive Retirement Cover"],
      expectedReturns: returnsNum,
      terms: terms || "Standard terms apply.",
      advisorId: currentUser?.id || "advisor-id",
    });

    if (res.success && res.quote) {
      // Auto present it to client for easy prototype testing
      MockStore.updateQuoteStatus(res.quote.id, "presented");
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/advisor");
      }, 1500);
    } else {
      setError(res.error || "Failed to create quote");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/advisor")}
          className="inline-flex items-center gap-1.5 text-[#A09890] hover:text-[#094029] text-[0.6875rem] font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to CRM
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1714] leading-tight">
          New Underwriter Quote Request
        </h1>
        <p className="text-xs text-[#7A746C] leading-relaxed">
          Source comparative pension packages for assigned clients.
        </p>
      </div>

      {isSuccess ? (
        <Card variant="success" className="text-center py-12 px-6">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-emerald-900 uppercase tracking-wide">Quotation Created & Published</h3>
            <p className="text-xs text-emerald-700 max-w-sm">
              The quotation details have been generated and marked as "presented". The client can now review and select this plan. Redirecting...
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Client Selection */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Assigned Client Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="clientSelect">Select Client Application</Label>
                <Select
                  id="clientSelect"
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                >
                  <option value="">-- Choose Client --</option>
                  {apps.map((a) => (
                    <option key={a.id} value={a.id}>
                      {getClientName(a.clientId)} ({a.stage.replace(/_/g, " ")})
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          {isLocked ? (
            <Card variant="danger" className="text-center flex flex-col items-center gap-4 py-12 px-6">
              <ShieldAlert className="w-12 h-12 text-[#B91C1C]" />
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-[#7F1D1D] uppercase tracking-wider">Agent Appointment Lock Active</h3>
              <p className="text-xs text-[#7F1D1D]/90 max-w-md leading-relaxed">
                You are barred from adding quotations or sourcing terms because this client has not signed the Ashanti Agent Appointment letter yet.
              </p>
            </Card>
          ) : (
            <Card variant="default">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#EAE7E0]/60">
                <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Quotation Metrics</CardTitle>
                <Building className="w-4 h-4 text-[#094029]" />
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreateRequest} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="provider">Insurance Company</Label>
                      <Select
                        id="provider"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        required
                      >
                        <option value="">-- Select Provider --</option>
                        {providers.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productType">Product Type</Label>
                      <Select
                        id="productType"
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                      >
                        <option value="Personal Pension Plan">Personal Pension Plan</option>
                        <option value="Group Pension Scheme">Group Pension Scheme</option>
                        <option value="Umbrella Pension Fund">Umbrella Pension Fund</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        type="text"
                        placeholder="e.g. Britam RetireEasy"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="premium">Monthly Premium (KES)</Label>
                        <Input
                          id="premium"
                          type="number"
                          placeholder="e.g. 10000"
                          value={premium}
                          onChange={(e) => setPremium(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="returns">Guaranteed Return (%)</Label>
                        <Input
                          id="returns"
                          type="number"
                          step="0.1"
                          placeholder="e.g. 5.5"
                          value={returns}
                          onChange={(e) => setReturns(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="benefits">Key Cover Benefits (One per line)</Label>
                    <textarea
                      id="benefits"
                      rows={3}
                      placeholder="e.g. Life cover inclusion&#10;Guaranteed return of 5%&#10;Free critical illness rider"
                      className="w-full px-4 py-[13px] font-[family-name:var(--font-body)] text-[0.9375rem] text-[#1A1714] bg-white/90 border-[1.5px] border-[#C8C2BA] focus:border-[#0F6B42] focus:bg-white rounded-[14px] outline-none transition-all duration-150 backdrop-blur-[8px] focus:shadow-[0_0_0_4px_rgba(9,64,41,0.09)] resize-none"
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="terms">Terms of Contract</Label>
                    <textarea
                      id="terms"
                      rows={2}
                      placeholder="Enter policy conditions..."
                      className="w-full px-4 py-[13px] font-[family-name:var(--font-body)] text-[0.9375rem] text-[#1A1714] bg-white/90 border-[1.5px] border-[#C8C2BA] focus:border-[#0F6B42] focus:bg-white rounded-[14px] outline-none transition-all duration-150 backdrop-blur-[8px] focus:shadow-[0_0_0_4px_rgba(9,64,41,0.09)] resize-none"
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                    />
                  </div>

                  {error && (
                    <Alert variant="error" icon={<ShieldAlert className="w-4 h-4" />}>
                      {error}
                    </Alert>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary">Submit Quotation</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<div className="text-center py-6 text-sm text-[#7A746C]">Loading form...</div>}>
      <QuoteRequestForm />
    </Suspense>
  );
}
