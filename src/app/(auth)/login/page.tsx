"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Label, Button, Alert } from "@/components/ui";
import { MockStore } from "@/lib/mockStore";
import { AlertCircle, User, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear session on login mount for fresh states
  useEffect(() => {
    MockStore.logout();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please fill in your email address.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = MockStore.login(email);
      setIsLoading(false);

      if (res.success && res.user) {
        router.push(`/${res.user.role}`);
      } else {
        setError(res.error || "Authentication failed");
      }
    }, 600);
  };

  const handleQuickSelect = (mockEmail: string) => {
    setEmail(mockEmail);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6 font-[family-name:var(--font-body)]">
      <div className="flex flex-col gap-1.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[#A09890] hover:text-[#094029] text-[0.6875rem] font-bold uppercase tracking-wider mb-2 transition-colors duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1714] leading-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-[#7A746C] leading-relaxed">
          Enter your registered email address to access your portal.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. client@ashanti.com"
            error={error ? "true" : undefined}
          />
        </div>

        {error && (
          <Alert variant="error" icon={<AlertCircle className="w-4 h-4" />}>
            {error}
          </Alert>
        )}

        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
          Access Portal
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs font-bold font-[family-name:var(--font-heading)] mt-2">
        <span className="text-[#A09890]">Don't have an account?</span>
        <Link href="/register" className="text-[#094029] hover:text-[#C49A45] transition-colors uppercase tracking-wider">
          Create Account
        </Link>
      </div>

      <div className="h-[1.5px] bg-[#EAE7E0] my-2" />

      {/* Mock Accounts Panel */}
      <div className="flex flex-col gap-3">
        <span className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-[#7A746C] text-center">
          Prototype Access (Quick Login)
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickSelect("client@ashanti.com")}
            className="flex items-center gap-2.5 p-2.5 border border-[#EAE7E0] bg-white/40 hover:bg-white hover:border-[#C49A45] hover:shadow-[0_4px_12px_rgba(9,64,41,0.04)] rounded-[14px] transition-all duration-200 text-left cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-[#FBF8F0] group-hover:bg-[#C49A45]/10 transition-colors">
              <User className="w-3.5 h-3.5 text-[#C49A45]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[#1A1714] text-[0.6875rem] truncate">Peter (Client)</span>
              <span className="text-[9px] text-[#A09890] truncate">client@ashanti.com</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect("advisor@ashanti.com")}
            className="flex items-center gap-2.5 p-2.5 border border-[#EAE7E0] bg-white/40 hover:bg-white hover:border-[#094029] hover:shadow-[0_4px_12px_rgba(9,64,41,0.04)] rounded-[14px] transition-all duration-200 text-left cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-[#ECFAF2] group-hover:bg-[#094029]/10 transition-colors">
              <User className="w-3.5 h-3.5 text-[#094029]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[#1A1714] text-[0.6875rem] truncate">David (Advisor)</span>
              <span className="text-[9px] text-[#A09890] truncate">advisor@ashanti.com</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect("referrer@ashanti.com")}
            className="flex items-center gap-2.5 p-2.5 border border-[#EAE7E0] bg-white/40 hover:bg-white hover:border-[#C49A45] hover:shadow-[0_4px_12px_rgba(9,64,41,0.04)] rounded-[14px] transition-all duration-200 text-left cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-[#FBF8F0] group-hover:bg-[#C49A45]/10 transition-colors">
              <User className="w-3.5 h-3.5 text-[#C49A45]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[#1A1714] text-[0.6875rem] truncate">Grace (Referrer)</span>
              <span className="text-[9px] text-[#A09890] truncate">referrer@ashanti.com</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect("admin@ashanti.com")}
            className="flex items-center gap-2.5 p-2.5 border border-[#EAE7E0] bg-white/40 hover:bg-white hover:border-[#B91C1C] hover:shadow-[0_4px_12px_rgba(9,64,41,0.04)] rounded-[14px] transition-all duration-200 text-left cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
              <User className="w-3.5 h-3.5 text-[#B91C1C]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[#1A1714] text-[0.6875rem] truncate">Jane (Admin)</span>
              <span className="text-[9px] text-[#A09890] truncate">admin@ashanti.com</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
