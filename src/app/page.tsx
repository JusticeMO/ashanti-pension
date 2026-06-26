"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  ArrowRight,
  ClipboardCheck,
  FileSignature,
  FileCheck,
  BadgeAlert,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { MockStore } from "@/lib/mockStore";

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [refCode, setRefCode] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Capture referral code from URL
  useEffect(() => {
    const code = searchParams.get("ref");
    if (code) {
      setRefCode(code);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ashanti_pension_captured_ref", code);
      }
    }
  }, [searchParams]);

  // Check login state
  useEffect(() => {
    const currentUser = MockStore.getCurrentUser();
    if (currentUser) {
      setIsLoggedIn(true);
      setUserRole(currentUser.role);
    }
  }, []);

  const handleStartReview = () => {
    if (isLoggedIn && userRole) {
      router.push(`/${userRole}`);
    } else {
      const url = refCode ? `/register?ref=${refCode}` : "/register";
      router.push(url);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Banner for referral code */}
      {refCode && (
        <div className="bg-[#C49A45] text-white py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider animate-fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Referral Code Active: <strong>{refCode}</strong>. Benefits will be applied.</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 bg-[#094029] text-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#C49A45] text-3xl font-serif">A</span>SHANTI
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
            <a href="#how-it-works" className="text-slate-200 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#appointment-lock" className="text-slate-200 hover:text-white transition-colors">
              Appointment Lock
            </a>
            <a href="#referrals" className="text-slate-200 hover:text-white transition-colors">
              Referrals
            </a>
            <a href="#contact" className="text-slate-200 hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          {/* Nav CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && userRole ? (
              <Button onClick={() => router.push(`/${userRole}`)} size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold uppercase text-slate-200 hover:text-white tracking-wider"
                >
                  Log In
                </Link>
                <Button onClick={handleStartReview} size="sm">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0C5535] border-t border-[#094029] p-6 flex flex-col gap-4 text-center">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 font-semibold uppercase py-2"
            >
              How It Works
            </a>
            <a
              href="#appointment-lock"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 font-semibold uppercase py-2"
            >
              Appointment Lock
            </a>
            <a
              href="#referrals"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 font-semibold uppercase py-2"
            >
              Referrals
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 font-semibold uppercase py-2"
            >
              Contact
            </a>
            <div className="h-px bg-[#094029] my-2" />
            {isLoggedIn && userRole ? (
              <Button onClick={() => router.push(`/${userRole}`)} className="w-full">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 font-semibold uppercase py-2"
                >
                  Log In
                </Link>
                <Button onClick={handleStartReview} className="w-full">
                  Get Started
                </Button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#094029] via-[#0C5535] to-[#0A4D3C] text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Dignified Outcomes. <br />
              <span className="text-[#C49A45]">Secure Retirement.</span>
            </h1>
            <p className="text-slate-200 text-base sm:text-lg max-w-lg leading-relaxed font-sans mx-auto md:mx-0">
              Ashanti Pension Advisory platform offers expert comparative reviews, personalized advisor relationships, and exclusive cashback benefits on your pension plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-2">
              <Button onClick={handleStartReview} size="lg" className="flex items-center gap-2">
                Start Pension Review
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Link href="/register?role=referrer" className="inline-flex">
                <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-[#094029]">
                  Become a Referrer
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="flex justify-center">
            <Card className="max-w-md w-full border-t-8 border-[#C49A45] shadow-2xl bg-white/95 text-slate-800 backdrop-blur-sm animate-scale-in">
              <CardContent className="p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ECFAF2] flex items-center justify-center text-[#094029]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">Ashanti Appointed</h3>
                    <span className="text-xs text-slate-400 font-sans">Official Agent Authorized</span>
                  </div>
                </div>

                <div className="bg-[#FBF6EC] border border-[#EBD7A3] p-4 rounded-xl flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#A37F35] uppercase tracking-wider font-sans">
                    The Agent Lock Rule
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    To maintain advisory integrity and secure your competitive cashback, Ashanti is appointed as your broker of record before premium negotiations commence.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-sans">Advisor Assignment</span>
                    <span className="font-semibold font-sans text-emerald-700">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-sans">Quotation Requests</span>
                    <span className="font-semibold font-sans text-slate-400">Locked until Appointment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Diagonal cut design */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-50 transform skew-y-1 origin-bottom-right" />
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-b border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-8 sm:gap-16 text-slate-400 text-sm font-bold uppercase tracking-wider font-sans">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#094029]" />
            <span>RBA Regulated Advisory</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#094029]" />
            <span>Optimized Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#094029]" />
            <span>Dedicated Advisor CRM</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-bold text-[#C49A45] uppercase tracking-widest font-sans">
              Workflow Lifecycle
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              The Journey to a Secure Retirement
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-sans">
              Our 4-step digital advisory process is designed to protect your interests and optimize your payout.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card className="bg-white border-slate-200/60 shadow-sm relative">
              <div className="absolute -top-4 left-6 bg-[#094029] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <CardContent className="p-6 pt-8 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECFAF2] text-[#094029] flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Create Account</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Register as a client or referrer. Clients fill out a basic profile.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-white border-[#C49A45]/30 border-t-4 shadow-sm relative">
              <div className="absolute -top-4 left-6 bg-[#C49A45] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <CardContent className="p-6 pt-8 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FBF6EC] text-[#A37F35] flex items-center justify-center">
                  <FileSignature className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Appoint Ashanti</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Sign the Ashanti Agent Appointment letter digitally to lock your advisory terms.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-white border-slate-200/60 shadow-sm relative">
              <div className="absolute -top-4 left-6 bg-[#094029] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <CardContent className="p-6 pt-8 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECFAF2] text-[#094029] flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Advisory Review</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Upload statements, and Ashanti prepares a comparative quote breakdown from top insurers.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="bg-white border-[#094029]/30 border-t-4 shadow-sm relative">
              <div className="absolute -top-4 left-6 bg-[#094029] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <CardContent className="p-6 pt-8 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECFAF2] text-[#094029] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Unlock Payout</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Select your product and receive a 50% cashback of the net agent commission!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Appointment Lock Section */}
      <section id="appointment-lock" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto bg-[#094029] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/[0.04]" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-white/[0.04]" />

          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-2 text-[#C49A45]">
              <BadgeAlert className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest font-sans">
                Critical Advisory Gate
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight max-w-xl">
              Why We Enforce the Ashanti Agent Appointment Letter
            </h2>

            <p className="text-slate-200 text-sm leading-relaxed font-sans max-w-2xl">
              To secure the best pension quotations and ensure compliance, Ashanti must be officially appointed by you as your broker/agent. This legal connection establishes the trust barrier required to request rates from insurance companies and ensures you receive the 50% net commission cashback reward. No quotation advisory work commences before this step.
            </p>

            <div className="flex items-start gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
              <div className="text-[#C49A45] font-serif font-bold text-xl pt-0.5">Note:</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Appointing Ashanti does not change your monthly contributions. It simply designates Ashanti as your advising intermediary, routing the agent commission through our platform to pay back half of it directly to you.
              </p>
            </div>

            <div className="mt-4">
              <Button onClick={handleStartReview} variant="primary" className="bg-[#C49A45] hover:bg-[#A37F35] text-white">
                Learn More & Sign Up
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section id="referrals" className="py-20 px-6 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold text-[#C49A45] uppercase tracking-widest font-sans">
              Passive Income
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Share Ashanti. <br />
              <span className="text-[#094029]">Earn 10% on Net Commissions.</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-sans">
              As an Ashanti Referrer, you help your network secure their retirement. Introduce clients to the Ashanti platform via your custom referral link. When they appoint Ashanti and choose a pension plan, you get 10% of Ashanti's net commission payout.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 bg-white p-4 rounded-xl">
                <span className="text-2xl font-bold font-serif text-[#094029]">10%</span>
                <p className="text-xs text-slate-400 font-sans mt-1">Direct Commission Share</p>
              </div>
              <div className="border border-slate-200 bg-white p-4 rounded-xl">
                <span className="text-2xl font-bold font-serif text-[#094029]">KES 0</span>
                <p className="text-xs text-slate-400 font-sans mt-1">Setup Fees. Completely Free</p>
              </div>
            </div>

            <div>
              <Link href="/register?role=referrer" className="inline-flex">
                <Button className="flex items-center gap-2">
                  Create Referrer Account
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-[#094029] rounded-3xl p-8 text-white flex flex-col gap-6 shadow-lg">
            <h3 className="font-serif font-bold text-xl text-white">Estimated Referrer Earnings</h3>
            <p className="text-xs text-slate-200 font-sans">
              Here is how a single client premium converts to your referral reward:
            </p>
            <div className="flex flex-col gap-3 font-sans text-sm border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-300">Client Monthly Premium</span>
                <span className="font-semibold text-white">KES 100,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Gross Ashanti Commission (3%)</span>
                <span className="font-semibold text-white">KES 3,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Net Ashanti Commission (after tax)</span>
                <span className="font-semibold text-white">KES 2,100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Ashanti Pool (50% of Net)</span>
                <span className="font-semibold text-white">KES 1,050</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base text-[#C49A45] font-bold">
                <span>Your Referral Payout (10%)</span>
                <span>KES 105</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-xl mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2">
            <span className="text-xs font-bold text-[#C49A45] uppercase tracking-widest font-sans">
              Get In Touch
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Speak to our Pension Experts
            </h2>
            <p className="text-slate-400 text-xs font-sans">
              Have questions about your pension review? Send us a message today.
            </p>
          </div>

          <Card className="p-6 border-slate-200/80 shadow-md">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-sans">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 font-sans text-sm text-slate-900 border border-slate-300 rounded-xl outline-none focus:border-[#094029]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 font-sans text-sm text-slate-900 border border-slate-300 rounded-xl outline-none focus:border-[#094029]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-sans">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain your pension query..."
                  className="w-full px-4 py-3 font-sans text-sm text-slate-900 border border-slate-300 rounded-xl outline-none focus:border-[#094029] resize-none"
                />
              </div>
              <Button type="button" className="w-full">
                Send Inquiry
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#094029] text-white py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              <span className="text-[#C49A45]">A</span>SHANTI PENSION
            </span>
            <span className="text-xs text-slate-400 font-sans">
              &copy; {new Date().getFullYear()} Ashanti Pension. All rights reserved.
            </span>
          </div>

          <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#appointment-lock" className="hover:text-white transition-colors">
              Agent Lock
            </a>
            <a href="#referrals" className="hover:text-white transition-colors">
              Referrals
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
