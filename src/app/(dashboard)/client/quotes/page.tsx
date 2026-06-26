"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile, Quote } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, Button, Badge } from "@/components/ui";
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

  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading quotes...</div>;
  }

  if (!currentUser || !app) {
    return <div className="text-center py-10 font-sans text-sm text-slate-400 font-bold">Details missing...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/client")}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <Badge variant={isLocked ? "warning" : selectedQuoteId ? "success" : "gold"}>
          {isLocked ? "Locked" : selectedQuoteId ? "Finalized" : "Awaiting Selection"}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          Advisory Comparison Matrix
        </h1>
        <p className="text-sm text-slate-400">
          Compare underwriters benefits, guaranteed rates, and cashback yields.
        </p>
      </div>

      {isLocked ? (
        <Card className="border-t-4 border-t-[#C49A45] bg-[#FBF6EC] shadow-sm p-6 text-center flex flex-col items-center gap-4 py-12">
          <RefreshCw className="w-12 h-12 text-[#C49A45] animate-spin" />
          <h3 className="font-serif font-bold text-lg text-slate-900">Comparing Terms & Negotiating</h3>
          <p className="text-sm text-slate-500 max-w-md">
            Our advisory team is negotiating with registered underwriters. As soon as the comparison data is available, your matrix will unlock.
          </p>
          <div className="text-xs text-slate-400 bg-white p-3 rounded-xl border border-slate-100 font-bold">
            Current Stage: {app.stage.replace(/_/g, " ").toUpperCase()}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {selectedQuoteId && (
            <div className="bg-[#ECFAF2] border-2 border-emerald-500/20 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong>Selection Lock Active.</strong> You selected your preferred pension. Advisory commission structures and your cashback calculations are generated in the administrative ledger.
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
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
                  className={`flex flex-col justify-between ${
                    isSelected ? "ring-2 ring-[#094029]" : ""
                  }`}
                >
                  <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[#094029] font-bold text-xs uppercase tracking-wider font-sans">
                          <Building2 className="w-4 h-4 text-[#C49A45]" />
                          <span>{quote.provider}</span>
                        </div>
                        <CardTitle className="mt-1">{quote.productName}</CardTitle>
                      </div>
                      {isSelected && (
                        <Badge variant="success" className="uppercase font-bold tracking-wider">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex flex-col gap-6">
                    {/* Valuation Grid */}
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-sans">
                          Monthly Premium
                        </span>
                        <div className="font-serif text-lg font-bold text-slate-800 mt-1">
                          KES {quote.premium.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-sans">
                          Expected Return
                        </span>
                        <div className="font-serif text-lg font-bold text-[#C49A45] mt-1 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {quote.expectedReturns}%
                        </div>
                      </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-sans">
                        Key Cover Benefits
                      </span>
                      <ul className="flex flex-col gap-1.5 text-xs text-slate-600 font-sans">
                        {quote.benefits.map((benefit, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-[#094029] font-bold mt-0.5">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Terms */}
                    <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-sans">
                        Underwriting Terms
                      </span>
                      <p className="text-[11px] text-slate-500 leading-normal font-sans">
                        {quote.terms}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 border-t border-slate-50">
                    {isSelected ? (
                      <div className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl uppercase tracking-wider">
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
