"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile, Quote } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, Button, Badge, Alert } from "@/components/ui";
import { ArrowLeft, Check, Sparkles, Building2, TrendingUp, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

export default function CompareQuotesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = MockStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const apps = MockStore.getApplications();
      const clientApp = apps.find((a) => a.clientId === user.id);
      if (clientApp) {
        setApp(clientApp);
        
        // CHECK GATING: Unlocked if options_ready, product_selected, or completed
        if (
          clientApp.stage === "options_ready" ||
          clientApp.stage === "product_selected" ||
          clientApp.stage === "completed"
        ) {
          setIsLocked(false);
          const allQuotes = MockStore.getQuotes();
          const clientQuotes = allQuotes.filter((q) => q.applicationId === clientApp.id);
          setQuotes(clientQuotes);

          // Find if there is an already selected quote
          const selected = clientQuotes.find((q) => q.status === "selected");
          if (selected) {
            setSelectedQuoteId(selected.id);
          }
        }
      }
    }
    setLoading(false);
  }, []);

  const handleSelectQuote = (quoteId: string) => {
    if (!app) return;
    setSubmitting(true);
    setError(null);

    setTimeout(() => {
      const res = MockStore.selectQuote(app.id, quoteId);
      setSubmitting(false);

      if (res.success) {
        setSelectedQuoteId(quoteId);
        // Refresh local details
        const apps = MockStore.getApplications();
        const clientApp = apps.find((a) => a.clientId === currentUser?.id);
        if (clientApp) setApp(clientApp);

        const allQuotes = MockStore.getQuotes();
        setQuotes(allQuotes.filter((q) => q.applicationId === app.id));
      } else {
        setError(res.error || "Failed to finalize quote selection");
      }
    }, 650);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading quotes...</span>
      </div>
    );
  }

  if (!currentUser || !app) {
    return <div className="text-center py-10 font-[family-name:var(--font-body)] text-xs text-[#A09890] font-bold uppercase tracking-wider">Details missing...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/client")}
          className="inline-flex items-center gap-1.5 text-[#A09890] hover:text-[#094029] text-[0.6875rem] font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Overview
        </button>
        <Badge variant={isLocked ? "warning" : selectedQuoteId ? "success" : "gold"}>
          {isLocked ? "Locked" : selectedQuoteId ? "Finalized" : "Awaiting Selection"}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1714] leading-tight">
          Advisory Comparison Matrix
        </h1>
        <p className="text-xs text-[#7A746C] leading-relaxed">
          Compare underwriters benefits, guaranteed rates, and cashback yields.
        </p>
      </div>

      {isLocked ? (
        <Card variant="gold" className="text-center flex flex-col items-center gap-4 py-12 px-6">
          <RefreshCw className="w-12 h-12 text-[#C49A45] animate-spin" />
          <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-[#1A1714] uppercase tracking-wider">Comparing Terms & Negotiating</h3>
          <p className="text-xs text-[#7A746C] max-w-md leading-relaxed">
            Our advisory team is negotiating with registered underwriters. As soon as the comparison data is available, your matrix will unlock.
          </p>
          <div className="text-[10px] font-bold text-[#A37F35] bg-[#FBF8F0] p-3 rounded-xl border border-[rgba(196,154,69,0.22)] uppercase tracking-wider">
            Current Stage: {app.stage.replace(/_/g, " ")}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {selectedQuoteId && (
            <Alert variant="success" icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}>
              <strong>Selection Lock Active.</strong> You selected your preferred pension. Advisory commission structures and your cashback calculations are generated in the administrative ledger.
            </Alert>
          )}

          {error && (
            <Alert variant="error" icon={<AlertCircle className="w-4 h-4" />}>
              {error}
            </Alert>
          )}

          {/* Quotes Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {quotes.map((quote) => {
              const isSelected = selectedQuoteId === quote.id;
              const hasSelectedAny = selectedQuoteId !== null;

              return (
                <Card
                  key={quote.id}
                  variant={isSelected ? "green" : "default"}
                  className="flex flex-col justify-between"
                >
                  <CardHeader className="bg-[#F8F6F3] p-6 border-b border-[#EAE7E0]/60 rounded-t-[20px]">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[#094029] font-bold text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                          <Building2 className="w-3.5 h-3.5 text-[#C49A45]" />
                          <span className="truncate">{quote.provider}</span>
                        </div>
                        <CardTitle className="mt-1 text-sm truncate uppercase tracking-wider">{quote.productName}</CardTitle>
                      </div>
                      {isSelected && (
                        <Badge variant="success" className="flex-shrink-0">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex flex-col gap-6 pt-6">
                    {/* Valuation Grid */}
                    <div className="grid grid-cols-2 gap-4 border-b border-[#EAE7E0]/60 pb-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#A09890] font-bold font-[family-name:var(--font-heading)]">
                          Monthly Premium
                        </span>
                        <div className="font-[family-name:var(--font-heading)] text-base font-bold text-[#1A1714] mt-1">
                          KES {quote.premium.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#A09890] font-bold font-[family-name:var(--font-heading)]">
                          Expected Return
                        </span>
                        <div className="font-[family-name:var(--font-heading)] text-base font-bold text-[#C49A45] mt-1 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-[#C49A45]" />
                          {quote.expectedReturns}%
                        </div>
                      </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-[#A09890] font-bold font-[family-name:var(--font-heading)]">
                        Key Cover Benefits
                      </span>
                      <ul className="flex flex-col gap-2 text-xs text-[#7A746C]">
                        {quote.benefits.map((benefit, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-[#094029] font-bold mt-0.5">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Terms */}
                    <div className="flex flex-col gap-1 bg-[#F8F6F3] p-3.5 rounded-xl border border-[#EAE7E0]/60">
                      <span className="text-[9px] uppercase tracking-widest text-[#A09890] font-bold font-[family-name:var(--font-heading)]">
                        Underwriting Terms
                      </span>
                      <p className="text-[11px] text-[#7A746C] leading-normal font-sans">
                        {quote.terms}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 border-t border-[#EAE7E0]/60 pt-6">
                    {isSelected ? (
                      <div className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-50 text-[#14532D] text-xs font-bold rounded-xl border border-emerald-100 uppercase tracking-wider font-[family-name:var(--font-heading)]">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Selected Scheme Active
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSelectQuote(quote.id)}
                        disabled={hasSelectedAny || submitting}
                        isLoading={submitting}
                        className="w-full"
                        variant="primary"
                      >
                        {hasSelectedAny ? "Selection Completed" : "Select This Scheme"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
