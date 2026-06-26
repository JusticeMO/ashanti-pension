"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Label, Button, Card, CardContent } from "@/components/ui";
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
        // Redirect to role-specific dashboard
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
          Welcome Back
        </h1>
        <p className="text-sm text-slate-400">
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
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Access Portal
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs font-semibold font-sans mt-2">
        <span className="text-slate-400">Don't have an account?</span>
        <Link href="/register" className="text-[#094029] hover:underline uppercase tracking-wider">
          Create Account
        </Link>
      </div>

      <div className="h-px bg-slate-200 my-4" />

      {/* Mock Accounts Panel */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
          Prototype Access (Quick Login)
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleQuickSelect("client@ashanti.com")}
            className="flex items-center gap-2 p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all text-left cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#C49A45]" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold truncate">Peter (Client)</span>
              <span className="text-[10px] text-slate-400 truncate">client@ashanti.com</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickSelect("advisor@ashanti.com")}
            className="flex items-center gap-2 p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all text-left cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#094029]" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold truncate">David (Advisor)</span>
              <span className="text-[10px] text-slate-400 truncate">advisor@ashanti.com</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickSelect("referrer@ashanti.com")}
            className="flex items-center gap-2 p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all text-left cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#C49A45]" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold truncate">Grace (Referrer)</span>
              <span className="text-[10px] text-slate-400 truncate">referrer@ashanti.com</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickSelect("admin@ashanti.com")}
            className="flex items-center gap-2 p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all text-left cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-rose-500" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold truncate">Jane (Admin)</span>
              <span className="text-[10px] text-slate-400 truncate">admin@ashanti.com</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
