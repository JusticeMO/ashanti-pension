"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Label, Button, Alert } from "@/components/ui";
import { MockStore } from "@/lib/mockStore";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { UserRole } from "@/lib/types";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [referrerCode, setReferrerCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract ref code from query param or local storage
  useEffect(() => {
    const code = searchParams.get("ref");
    if (code) {
      setReferrerCode(code);
    } else {
      const stored = window.localStorage.getItem("ashanti_pension_captured_ref");
      if (stored) {
        setReferrerCode(stored);
      }
    }
  }, [searchParams]);

  // Adjust role parameter from URL if present (e.g. ?role=referrer)
  useEffect(() => {
    const urlRole = searchParams.get("role");
    if (urlRole === "referrer") {
      setRole("referrer");
    } else if (urlRole === "client") {
      setRole("client");
    }
  }, [searchParams]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!fullName || !email || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = MockStore.register({
        fullName,
        email,
        phone,
        role,
        referrerCode: referrerCode || undefined,
      });
      setIsLoading(false);

      if (res.success && res.user) {
        router.push(`/${res.user.role}`);
      } else {
        setError(res.error || "Registration failed. Try using a different email address.");
      }
    }, 600);
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
          Create Account
        </h1>
        <p className="text-xs text-[#7A746C] leading-relaxed">
          Get started as a pension client or a platform referrer.
        </p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Peter Kamau"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. peter@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +254 700 777 888"
            required
          />
        </div>

        <div>
          <Label>Account Type</Label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`p-3.5 rounded-[14px] border-[1.5px] text-left cursor-pointer transition-all duration-200 ${
                role === "client"
                  ? "border-[#094029] bg-[#ECFAF2]/60 shadow-[0_4px_16px_rgba(9,64,41,0.06)]"
                  : "border-[#C8C2BA] bg-white/40 hover:bg-white hover:border-[#094029]"
              }`}
            >
              <div className="font-bold text-xs text-[#1A1714] font-[family-name:var(--font-heading)] uppercase tracking-wider">Client</div>
              <div className="text-[10px] text-[#7A746C] mt-1 leading-snug">Pension Review & Advisory</div>
            </button>
            <button
              type="button"
              onClick={() => setRole("referrer")}
              className={`p-3.5 rounded-[14px] border-[1.5px] text-left cursor-pointer transition-all duration-200 ${
                role === "referrer"
                  ? "border-[#094029] bg-[#ECFAF2]/60 shadow-[0_4px_16px_rgba(9,64,41,0.06)]"
                  : "border-[#C8C2BA] bg-white/40 hover:bg-white hover:border-[#094029]"
              }`}
            >
              <div className="font-bold text-xs text-[#1A1714] font-[family-name:var(--font-heading)] uppercase tracking-wider">Referrer</div>
              <div className="text-[10px] text-[#7A746C] mt-1 leading-snug">Earn Referral Commissions</div>
            </button>
          </div>
        </div>

        {role === "client" && (
          <div>
            <Label htmlFor="referrerCode">Referral Code (Optional)</Label>
            <Input
              id="referrerCode"
              type="text"
              value={referrerCode}
              onChange={(e) => setReferrerCode(e.target.value)}
              placeholder="e.g. GRACE555"
            />
            <p className="text-[10px] text-[#A09890] mt-1 font-sans">
              Enter a friend's code to link your account to their referral tree.
            </p>
          </div>
        )}

        {error && (
          <Alert variant="error" icon={<AlertCircle className="w-4 h-4" />}>
            {error}
          </Alert>
        )}

        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
          Register & Log In
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs font-bold font-[family-name:var(--font-heading)] mt-2">
        <span className="text-[#A09890]">Already have an account?</span>
        <Link href="/login" className="text-[#094029] hover:text-[#C49A45] transition-colors uppercase tracking-wider">
          Log In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center py-6 text-sm text-[#7A746C]">Loading form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
