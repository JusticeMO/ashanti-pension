"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileSignature,
  FileSpreadsheet,
  FileStack,
  FolderOpen,
  Users,
  Percent,
  Building,
  UserSquare2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { MockStore } from "@/lib/mockStore";
import { Profile } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authenticate user on mount
  useEffect(() => {
    const user = MockStore.getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      // Basic route guard checks
      const pathSegments = pathname.split("/");
      const section = pathSegments[1]; // e.g. "client", "advisor", "referrer", "admin"
      
      if (
        (section === "client" && user.role !== "client") ||
        (section === "advisor" && user.role !== "advisor") ||
        (section === "referrer" && user.role !== "referrer") ||
        (section === "admin" && user.role !== "admin")
      ) {
        // Mismatch - redirect to their actual dashboard
        router.push(`/${user.role}`);
      } else {
        setCurrentUser(user);
        setIsLoading(false);
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    MockStore.logout();
    router.push("/login");
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center font-[family-name:var(--font-body)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
          <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] font-[family-name:var(--font-heading)]">
            Loading Secure Workspace...
          </span>
        </div>
      </div>
    );
  }

  // Define nav links by role
  const getNavLinks = () => {
    switch (currentUser.role) {
      case "client":
        return [
          { href: "/client", label: "My Pension Flow", icon: LayoutDashboard },
          { href: "/client/appointment", label: "Agent Appointment", icon: FileSignature },
          { href: "/client/worksheet", label: "Upload Worksheet", icon: FileSpreadsheet },
          { href: "/client/quotes", label: "Compare Options", icon: FileStack },
          { href: "/client/documents", label: "My Documents", icon: FolderOpen },
        ];
      case "advisor":
        return [
          { href: "/advisor", label: "CRM Pipeline", icon: LayoutDashboard },
          { href: "/advisor/quotes/new", label: "Request Quote", icon: FileSignature },
        ];
      case "referrer":
        return [
          { href: "/referrer", label: "My Referrals", icon: LayoutDashboard },
        ];
      case "admin":
        return [
          { href: "/admin", label: "System Overview", icon: LayoutDashboard },
          { href: "/admin/users", label: "User Accounts", icon: Users },
          { href: "/admin/commissions", label: "Commission Ledger", icon: Percent },
          { href: "/admin/providers", label: "Providers List", icon: Building },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-[family-name:var(--font-body)] text-[#1A1714]">
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-[20px] border-b border-[#EAE7E0]/60 z-30 h-16 flex items-center px-6 justify-between lg:px-8 shadow-[0_1px_3px_rgba(9,64,41,0.03)]">
        <div className="flex items-center gap-4">
          {/* Hamburger toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-[#4A4540] hover:text-[#1A1714] hover:bg-[#F0EDE8] rounded-xl cursor-pointer transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-[#094029] flex items-center gap-1.5 uppercase">
              <span className="text-[#C49A45] text-xl font-bold font-[family-name:var(--font-heading)]">A</span>shanti
            </span>
          </Link>
          <div className="h-4 w-px bg-[#EAE7E0] hidden sm:block" />
          <span className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-[#C49A45] hidden sm:block">
            {currentUser.role} portal
          </span>
        </div>

        {/* User profile dropdown info / logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm text-right">
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-[#1A1714] leading-tight text-xs">{currentUser.fullName}</span>
              <span className="text-[9px] text-[#A09890] font-bold uppercase tracking-wider truncate max-w-[150px]">
                {currentUser.role}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#094029] to-[#0C5535] text-white flex items-center justify-center font-bold text-xs shadow-inner uppercase">
              {currentUser.fullName.charAt(0)}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-[#7A746C] hover:text-[#B91C1C] hover:bg-[#FEE2E2]/60 rounded-xl cursor-pointer transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 bg-white/70 backdrop-blur-[20px] border-r border-[#EAE7E0]/60 w-64 z-20 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="py-6 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3.5 py-3 px-5 mx-3 rounded-[12px] text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-[#094029] text-white shadow-[0_4px_16px_rgba(9,64,41,0.15)]"
                      : "text-[#7A746C] hover:bg-[#ECFAF2]/80 hover:text-[#094029]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#C49A45]" : "text-current"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Info Box at Sidebar Bottom */}
          <div className="p-4.5 m-4 bg-[#F8F6F3] border border-[#EAE7E0]/80 rounded-[18px] flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[#1A1714] text-[0.625rem] font-bold uppercase tracking-[0.1em]">
              <UserSquare2 className="w-4 h-4 text-[#094029]" />
              <span>Assigned Role</span>
            </div>
            <p className="text-[10px] text-[#7A746C] leading-normal">
              You are currently viewing Ashanti workspace as a registered <strong className="text-[#094029] uppercase">{currentUser.role}</strong>.
            </p>
          </div>
        </aside>

        {/* Backdrop for mobile menu */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 top-16 bg-[#1A1714]/20 backdrop-blur-[4px] z-10 lg:hidden transition-opacity"
          />
        )}

        {/* Dashboard Content */}
        <main className="flex-1 lg:pl-64 min-h-[calc(100vh-4rem)] p-6 sm:p-8 relative">
          {/* Ambient light glow inside content area */}
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#ECFAF2]/40 blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#FBF8F0]/50 blur-[120px] pointer-events-none z-0" />
          
          <div className="max-w-6xl mx-auto relative z-10 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
