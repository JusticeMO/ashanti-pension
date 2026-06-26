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
  User,
  ShieldAlert,
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#094029]" />
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-[#094029] text-white z-30 shadow-md h-16 flex items-center px-6 justify-between lg:px-8">
        <div className="flex items-center gap-4">
          {/* Hamburger toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-white hover:text-slate-200 cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span className="text-[#C49A45] text-xl font-serif">A</span>SHANTI
            </span>
          </Link>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#C49A45] hidden sm:block">
            {currentUser.role} portal
          </span>
        </div>

        {/* User profile dropdown info / logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-right">
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-white leading-tight">{currentUser.fullName}</span>
              <span className="text-[10px] text-slate-300 font-medium truncate max-w-[150px]">
                {currentUser.email}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#C49A45] text-white flex items-center justify-center font-bold text-sm shadow-inner">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-300 hover:text-rose-400 hover:bg-white/5 rounded-full cursor-pointer transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 bg-white border-r border-slate-200/80 w-64 z-20 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
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
                  className={`flex items-center gap-3 py-3 px-6 mx-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-[#094029] text-white shadow-sm"
                      : "text-slate-500 hover:bg-[#ECFAF2] hover:text-[#094029]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#C49A45]" : "text-current"}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Info Box at Sidebar Bottom */}
          <div className="p-4 m-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <UserSquare2 className="w-4 h-4 text-[#094029]" />
              <span>Assigned Role</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal font-sans">
              You are currently viewing Ashanti workspace as a registered <strong>{currentUser.role}</strong>.
            </p>
          </div>
        </aside>

        {/* Backdrop for mobile menu */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 top-16 bg-black/40 z-10 lg:hidden transition-opacity"
          />
        )}

        {/* Dashboard Content */}
        <main className="flex-1 lg:pl-64 min-h-[calc(100vh-4rem)] bg-slate-50 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
