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
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-[family-name:var(--font-body)] text-[#1A1714] overflow-x-hidden selection:bg-[#C49A45]/20 selection:text-[#094029]">
      {/* Top Banner for referral code */}
      {refCode && (
        <div className="bg-gradient-to-r from-[#C49A45] to-[#D4AF5F] text-white py-2.5 px-4 text-center text-[0.6875rem] font-bold uppercase tracking-widest animate-fade-in flex items-center justify-center gap-2 relative z-50 shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
          <span>Referral Code Active: <strong className="underline">{refCode}</strong>. exclusive Benefits Applied.</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-[20px] border-b border-[#EAE7E0]/60 text-[#1A1714] z-40 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-[#094029] flex items-center gap-1.5 uppercase transition-opacity group-hover:opacity-90">
              <span className="text-[#C49A45] text-3xl font-bold font-[family-name:var(--font-heading)]">A</span>shanti
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[0.6875rem] font-bold tracking-[0.1em] uppercase text-[#7A746C]">
            <a href="#how-it-works" className="hover:text-[#094029] transition-colors">
              How It Works
            </a>
            <a href="#appointment-lock" className="hover:text-[#094029] transition-colors">
              Appointment Lock
            </a>
            <a href="#referrals" className="hover:text-[#094029] transition-colors">
              Referrals
            </a>
            <a href="#contact" className="hover:text-[#094029] transition-colors">
              Contact
            </a>
          </nav>

          {/* Nav CTAs */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn && userRole ? (
              <Button onClick={() => router.push(`/${userRole}`)} variant="secondary" size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[0.6875rem] font-bold uppercase text-[#7A746C] hover:text-[#094029] tracking-widest transition-colors"
                >
                  Log In
                </Link>
                <Button onClick={handleStartReview} variant="primary" size="sm">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#4A4540] hover:text-[#094029] hover:bg-[#F0EDE8] rounded-xl cursor-pointer transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[#EAE7E0]/60 p-6 flex flex-col gap-4 text-center shadow-lg animate-fade-in">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#7A746C] hover:text-[#094029] font-bold uppercase tracking-wider py-2"
            >
              How It Works
            </a>
            <a
              href="#appointment-lock"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#7A746C] hover:text-[#094029] font-bold uppercase tracking-wider py-2"
            >
              Appointment Lock
            </a>
            <a
              href="#referrals"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#7A746C] hover:text-[#094029] font-bold uppercase tracking-wider py-2"
            >
              Referrals
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#7A746C] hover:text-[#094029] font-bold uppercase tracking-wider py-2"
            >
              Contact
            </a>
            <div className="h-px bg-[#EAE7E0] my-2" />
            {isLoggedIn && userRole ? (
              <Button onClick={() => { setMobileMenuOpen(false); router.push(`/${userRole}`); }} className="w-full">
                Go to Dashboard
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#7A746C] hover:text-[#094029] font-bold uppercase py-2 tracking-widest"
                >
                  Log In
                </Link>
                <Button onClick={() => { setMobileMenuOpen(false); handleStartReview(); }} className="w-full">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-[#ECFAF2] blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-[-100px] w-96 h-96 rounded-full bg-[#FBF8F0] blur-[120px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
          <div className="md:col-span-7 flex flex-col gap-6 text-center md:text-left pr-4">
            <div className="inline-flex items-center justify-center md:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-[3px] bg-[#ECFAF2] text-[#094029] border border-[#094029]/15 text-[0.625rem] font-bold tracking-[0.06em] uppercase rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#094029]" />
                RBA Regulated Pension Advisory
              </span>
            </div>
            
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight text-[#1A1714]">
              Dignified Outcomes. <br />
              <span className="bg-gradient-to-r from-[#094029] via-[#0C5535] to-[#C49A45] bg-clip-text text-transparent">
                Secure Retirement.
              </span>
            </h1>
            
            <p className="text-[#7A746C] text-sm sm:text-[0.9375rem] max-w-lg leading-relaxed mx-auto md:mx-0">
              Ashanti Pension Advisory platform offers expert comparative reviews, personalized advisor relationships, and exclusive cashback benefits on your pension plan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-2">
              <Button onClick={handleStartReview} variant="primary" size="lg" className="flex items-center gap-2">
                Start Pension Review
                <ArrowRight className="w-4 h-4 text-white" />
              </Button>
              <Link href="/register?role=referrer" className="inline-flex">
                <Button variant="outline" size="lg" className="w-full">
                  Become a Referrer
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="md:col-span-5 flex justify-center">
            <Card variant="gold" className="max-w-md w-full animate-scale-in">
              <CardContent className="p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[#ECFAF2] flex items-center justify-center text-[#094029]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-sm text-[#1A1714] uppercase tracking-wider">Ashanti Appointed</h3>
                    <span className="text-[10px] text-[#A09890] font-bold uppercase tracking-wider">Official Agent Authorized</span>
                  </div>
                </div>

                <div className="bg-[#FBF8F0] border border-[rgba(196,154,69,0.22)] p-4.5 rounded-[16px] flex flex-col gap-2">
                  <span className="text-[0.6875rem] font-bold text-[#8A6A25] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    The Agent Lock Rule
                  </span>
                  <p className="text-xs text-[#7A746C] leading-relaxed font-normal">
                    To maintain advisory integrity and secure your competitive cashback, Ashanti is appointed as your broker of record before premium negotiations commence.
                  </p>
                </div>

                <div className="flex flex-col gap-3 font-[family-name:var(--font-heading)]">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-[#7A746C]">Advisor Assignment</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mt-1">
                    <span className="text-[#7A746C]">Quotation Requests</span>
                    <span className="text-[#A09890] bg-[#F0EDE8] px-2.5 py-0.5 rounded-full border border-[#EAE7E0]">Locked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-y border-[#EAE7E0]/60 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-8 sm:gap-16 text-[#A09890] text-[0.6875rem] font-bold uppercase tracking-[0.12em] font-[family-name:var(--font-heading)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#094029]" />
            <span>RBA Regulated Advisory</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#094029]" />
            <span>Optimized Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#094029]" />
            <span>Dedicated Advisor CRM</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-24 px-6 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[0.6875rem] font-bold text-[#C49A45] uppercase tracking-widest font-[family-name:var(--font-heading)]">
              Workflow Lifecycle
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#1A1714]">
              Journey to a Secure Retirement
            </h2>
            <p className="text-[#7A746C] text-sm">
              Our 4-step digital advisory process is designed to protect your interests and optimize your payout.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <Card variant="default" className="relative group">
              <div className="absolute -top-3.5 left-6 bg-[#094029] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm font-[family-name:var(--font-heading)]">
                1
              </div>
              <CardContent className="p-6 pt-8 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#ECFAF2] text-[#094029] flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-[#1A1714]">Create Account</h3>
                <p className="text-xs text-[#7A746C] leading-relaxed">
                  Register as a client or referrer. Clients fill out a basic profile.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card variant="gold" className="relative group">
              <div className="absolute -top-3.5 left-6 bg-[#C49A45] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm font-[family-name:var(--font-heading)]">
                2
              </div>
              <CardContent className="p-6 pt-8 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#FBF8F0] text-[#8A6A25] flex items-center justify-center">
                  <FileSignature className="w-5 h-5" />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-[#1A1714]">Appoint Ashanti</h3>
                <p className="text-xs text-[#7A746C] leading-relaxed">
                  Sign the Ashanti Agent Appointment letter digitally to lock your advisory terms.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card variant="default" className="relative group">
              <div className="absolute -top-3.5 left-6 bg-[#094029] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm font-[family-name:var(--font-heading)]">
                3
              </div>
              <CardContent className="p-6 pt-8 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#ECFAF2] text-[#094029] flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-[#1A1714]">Advisory Review</h3>
                <p className="text-xs text-[#7A746C] leading-relaxed">
                  Upload statements, and Ashanti prepares a comparative quote breakdown from top insurers.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card variant="green" className="relative group">
              <div className="absolute -top-3.5 left-6 bg-[#094029] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm font-[family-name:var(--font-heading)]">
                4
              </div>
              <CardContent className="p-6 pt-8 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#ECFAF2] text-[#094029] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-[#1A1714]">Unlock Payout</h3>
                <p className="text-xs text-[#7A746C] leading-relaxed">
                  Select your product and receive a 50% cashback of the net agent commission!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Appointment Lock Section */}
      <section id="appointment-lock" className="py-20 px-6 bg-white relative">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#051a10] via-[#094029] to-[#0A4D3C] text-white rounded-[28px] p-8 sm:p-12 relative overflow-hidden shadow-[0_16px_48px_rgba(9,64,41,0.22)]">
          <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-[#C49A45]/[0.08] blur-[80px]" />
          <div className="absolute -left-24 -bottom-24 w-64 h-64 rounded-full bg-[#19A76A]/[0.06] blur-[80px]" />

          <div className="flex flex-col gap-6 relative z-10">
            <div className="inline-flex items-center justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-[3px] bg-white/10 text-[#D4AF5F] border border-white/10 text-[0.625rem] font-bold tracking-[0.06em] uppercase rounded-full">
                <BadgeAlert className="w-3.5 h-3.5 text-[#C49A45]" />
                Critical Advisory Gate
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-extrabold leading-tight max-w-xl">
              Why We Enforce the Ashanti Agent Appointment Letter
            </h2>

            <p className="text-[#E0DBD5] text-sm leading-relaxed max-w-2xl">
              To secure the best pension quotations and ensure compliance, Ashanti must be officially appointed by you as your broker/agent. This legal connection establishes the trust barrier required to request rates from insurance companies and ensures you receive the 50% net commission cashback reward. No quotation advisory work commences before this step.
            </p>

            <div className="flex items-start gap-4 bg-white/5 p-4.5 rounded-[18px] border border-white/10 max-w-2xl">
              <div className="text-[#C49A45] font-[family-name:var(--font-heading)] font-bold text-sm uppercase tracking-wider pt-0.5">Note:</div>
              <p className="text-xs text-[#E0DBD5] leading-relaxed">
                Appointing Ashanti does not change your monthly contributions. It simply designates Ashanti as your advising intermediary, routing the agent commission through our platform to pay back half of it directly to you.
              </p>
            </div>

            <div className="mt-4">
              <Button onClick={handleStartReview} variant="primary">
                Learn More & Sign Up
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section id="referrals" className="py-20 lg:py-24 px-6 bg-[#FAFAF7] border-y border-[#EAE7E0]/60">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 flex flex-col gap-6">
            <span className="text-[0.6875rem] font-bold text-[#C49A45] uppercase tracking-widest font-[family-name:var(--font-heading)]">
              Passive Income
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#1A1714] leading-tight">
              Share Ashanti. <br />
              <span className="text-[#094029]">Earn 10% on Net Commissions.</span>
            </h2>
            <p className="text-[#7A746C] text-sm leading-relaxed max-w-xl">
              As an Ashanti Referrer, you help your network secure their retirement. Introduce clients to the Ashanti platform via your custom referral link. When they appoint Ashanti and choose a pension plan, you get 10% of Ashanti's net commission payout.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="border border-[#EAE7E0]/80 bg-white/70 backdrop-blur-sm p-4.5 rounded-[18px] shadow-[0_2px_8px_rgba(9,64,41,0.03)]">
                <span className="text-2xl font-bold font-[family-name:var(--font-heading)] text-[#094029]">10%</span>
                <p className="text-[10px] text-[#A09890] font-bold uppercase tracking-wider mt-1.5 font-[family-name:var(--font-heading)]">Direct Share</p>
              </div>
              <div className="border border-[#EAE7E0]/80 bg-white/70 backdrop-blur-sm p-4.5 rounded-[18px] shadow-[0_2px_8px_rgba(9,64,41,0.03)]">
                <span className="text-2xl font-bold font-[family-name:var(--font-heading)] text-[#094029]">KES 0</span>
                <p className="text-[10px] text-[#A09890] font-bold uppercase tracking-wider mt-1.5 font-[family-name:var(--font-heading)]">Setup Cost</p>
              </div>
            </div>

            <div className="mt-2">
              <Link href="/register?role=referrer" className="inline-flex">
                <Button variant="secondary" className="flex items-center gap-2">
                  Create Referrer Account
                  <ChevronRight className="w-4 h-4 text-white" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-br from-[#051a10] to-[#094029] rounded-[24px] p-8 text-white flex flex-col gap-6 shadow-[0_16px_36px_rgba(9,64,41,0.18)]">
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-white uppercase tracking-wider">Referrer Earnings Estimator</h3>
            <p className="text-xs text-[#E0DBD5]">
              How a single client premium converts to your referral reward:
            </p>
            <div className="flex flex-col gap-3 font-sans text-xs border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span className="text-[#A09890] font-bold uppercase tracking-wider">Client Premium (Monthly)</span>
                <span className="font-bold text-white">KES 100,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A09890] font-bold uppercase tracking-wider">Gross Commission (3%)</span>
                <span className="font-bold text-white">KES 3,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A09890] font-bold uppercase tracking-wider">Net Commission (after tax)</span>
                <span className="font-bold text-white">KES 2,100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A09890] font-bold uppercase tracking-wider">Ashanti Pool (50%)</span>
                <span className="font-bold text-white">KES 1,050</span>
              </div>
              <div className="flex justify-between border-t border-white/15 pt-3.5 text-sm text-[#C49A45] font-extrabold uppercase tracking-wider font-[family-name:var(--font-heading)]">
                <span>Referral Reward (10%)</span>
                <span className="text-white bg-[#C49A45] px-2.5 py-0.5 rounded-full">KES 105</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-white relative">
        <div className="max-w-xl mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2">
            <span className="text-[0.6875rem] font-bold text-[#C49A45] uppercase tracking-widest font-[family-name:var(--font-heading)]">
              Get In Touch
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#1A1714]">
              Speak to our Pension Experts
            </h2>
            <p className="text-[#7A746C] text-xs">
              Have questions about your pension review? Send us a message today.
            </p>
          </div>

          <Card variant="flat" className="p-8 shadow-[0_8px_32px_rgba(9,64,41,0.04)]">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-[#4A4540] mb-1.5 font-[family-name:var(--font-heading)]">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 font-sans text-sm text-[#1A1714] bg-[#FAFAF7] border border-[#C8C2BA] focus:border-[#094029] rounded-[12px] outline-none transition-all focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-[#4A4540] mb-1.5 font-[family-name:var(--font-heading)]">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 font-sans text-sm text-[#1A1714] bg-[#FAFAF7] border border-[#C8C2BA] focus:border-[#094029] rounded-[12px] outline-none transition-all focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-[#4A4540] mb-1.5 font-[family-name:var(--font-heading)]">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain your pension query..."
                  className="w-full px-4 py-3 font-sans text-sm text-[#1A1714] bg-[#FAFAF7] border border-[#C8C2BA] focus:border-[#094029] rounded-[12px] outline-none transition-all focus:bg-white resize-none"
                />
              </div>
              <Button type="button" variant="primary" className="w-full mt-2">
                Send Inquiry
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#051a10] text-[#E0DBD5] py-16 px-6 border-t border-[#094029]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-white uppercase">
              <span className="text-[#C49A45]">A</span>shanti Pension
            </span>
            <span className="text-xs text-[#A09890]">
              &copy; {new Date().getFullYear()} Ashanti Pension. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-[0.6875rem] font-bold uppercase tracking-widest text-[#7A746C]">
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
