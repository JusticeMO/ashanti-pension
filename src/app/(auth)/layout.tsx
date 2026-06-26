import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-[family-name:var(--font-body)]">
      {/* Brand Sidebar (Visible on Desktop) */}
      <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#051a10] via-[#094029] to-[#0A4D3C] text-white p-12 flex-col justify-between relative overflow-hidden shadow-[r-20px_rgba(9,64,41,0.15)]">
        {/* Glow orbs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#C49A45]/[0.08] blur-[80px]" />
        <div className="absolute top-1/2 right-[-100px] w-64 h-64 rounded-full bg-[#19A76A]/[0.1] blur-[70px]" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-[#C49A45]/[0.06] blur-[90px]" />

        <Link href="/" className="flex items-center gap-2 relative z-10 hover:opacity-90 transition-opacity">
          <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-white uppercase">
            <span className="text-[#C49A45]">A</span>shanti
          </span>
        </Link>

        <div className="flex flex-col gap-6 relative z-10 my-auto pr-6">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
            Secure Your <br />
            <span className="bg-gradient-to-r from-[#D4AF5F] via-[#E2C882] to-[#D4AF5F] bg-clip-text text-transparent">
              Financial Legacy
            </span>
          </h2>
          <p className="text-[#E0DBD5] text-[0.9375rem] leading-relaxed max-w-sm font-normal">
            Access our digital advisory pipeline, view competitive quotations, track client commissions, or check your referral payouts in real time.
          </p>

          <div className="flex items-center gap-2 mt-4 text-[#D4AF5F] font-bold text-xs uppercase tracking-wider font-[family-name:var(--font-heading)]">
            <ShieldCheck className="w-5 h-5 text-[#C49A45]" />
            <span>RBA Regulated Intermediary</span>
          </div>
        </div>

        <div className="text-xs text-[#A09890] font-[family-name:var(--font-heading)] font-semibold tracking-wider uppercase relative z-10">
          &copy; {new Date().getFullYear()} Ashanti Pension. All rights reserved.
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 md:col-span-7 bg-[#FAFAF7] relative">
        {/* Subtle decorative background blur on the right side */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#ECFAF2] blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-[#FBF8F0] blur-[100px] pointer-events-none z-0" />

        <div className="mx-auto w-full max-w-md relative z-10">
          {/* Small Brand Header for Mobile */}
          <div className="flex justify-center md:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-[#094029] uppercase">
                <span className="text-[#C49A45]">A</span>shanti
              </span>
            </Link>
          </div>

          <div className="bg-white/75 backdrop-blur-[20px] border border-white/90 p-8 sm:p-10 rounded-[28px] shadow-[0_8px_32px_rgba(9,64,41,0.06),0_2px_8px_rgba(9,64,41,0.04)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
