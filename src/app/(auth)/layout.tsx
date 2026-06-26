import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:grid md:grid-cols-12">
      {/* Brand Sidebar (Visible on Desktop) */}
      <div className="hidden md:flex md:col-span-5 bg-[#094029] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background designs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/[0.03]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/[0.03]" />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            <span className="text-[#C49A45]">A</span>SHANTI
          </span>
        </Link>

        <div className="flex flex-col gap-6 relative z-10 my-auto">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight">
            Secure Your Financial Legacy
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed font-sans max-w-sm">
            Access our digital advisory pipeline, view competitive quotations, track client commissions, or check your referral payouts in real time.
          </p>

          <div className="flex items-center gap-2 mt-4 text-[#C49A45] font-semibold text-xs uppercase tracking-wider font-sans">
            <ShieldCheck className="w-5 h-5" />
            <span>RBA Regulated Intermediary</span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-sans relative z-10">
          &copy; {new Date().getFullYear()} Ashanti Pension. All rights reserved.
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 md:col-span-7 bg-slate-50 md:bg-white">
        <div className="mx-auto w-full max-w-md">
          {/* Small Brand Header for Mobile */}
          <div className="flex justify-center md:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#094029]">
                <span className="text-[#C49A45]">A</span>SHANTI
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
