"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Label, Button, Select } from "@/components/ui";
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
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-wider mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          Create Account
        </h1>
        <p className="text-sm text-slate-400">
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
          <Label htmlFor="role">Account Type</Label>
          <Select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="client">Client (Pension Review & Advisory)</option>
            <option value="referrer">Referrer (Earn Referral Commissions)</option>
          </Select>
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
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              Enter a friend's code to link your account to their referral tree.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Register & Log In
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs font-semibold font-sans mt-2">
        <span className="text-slate-400">Already have an account?</span>
        <Link href="/login" className="text-[#094029] hover:underline uppercase tracking-wider">
          Log In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center py-6 text-sm text-slate-400">Loading form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
