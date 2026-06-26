"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { Profile, UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Select, SectionHeader } from "@/components/ui";
import { ArrowLeft, UserCog, UserCheck, Trash2 } from "lucide-react";

export default function UserAccountsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setProfiles(MockStore.getProfiles());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = profiles.map((p) => {
      if (p.id === userId) {
        return { ...p, role: newRole };
      }
      return p;
    });
    setProfiles(updated);
    MockStore.setProfiles(updated);
    alert(`Successfully changed role to ${newRole}`);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="danger">Admin</Badge>;
      case "advisor":
        return <Badge variant="green">Advisor</Badge>;
      case "referrer":
        return <Badge variant="gold">Referrer</Badge>;
      case "client":
        return <Badge variant="info">Client</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading accounts ledger...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-[#A09890] hover:text-[#094029] text-[0.6875rem] font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <span className="text-[10px] text-[#A09890] font-bold uppercase tracking-widest font-[family-name:var(--font-heading)]">
          System Accounts: {profiles.length}
        </span>
      </div>

      <SectionHeader
        overline="System Administration"
        title="System User Accounts"
        subtitle="Monitor active registration records and adjust operational roles."
      />

      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#EAE7E0]/60">
          <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Registry Table</CardTitle>
          <UserCog className="w-4 h-4 text-[#094029]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-[#F8F6F3] text-[#7A746C] border-b border-[#EAE7E0]/60 uppercase tracking-widest font-bold font-[family-name:var(--font-heading)]">
                  <th className="p-4 pl-6">User Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Referral Code</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4 pr-6 text-right">Adjust Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE7E0]/40 font-medium text-[#4A4540]">
                {profiles.map((user) => (
                  <tr key={user.id} className="hover:bg-white/40 transition-colors">
                    <td className="p-4 pl-6 font-bold text-[#1A1714] font-[family-name:var(--font-heading)] uppercase tracking-wider flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#F0EDE8] flex items-center justify-center font-bold text-[9px] text-[#7A746C] uppercase">
                        {user.fullName.charAt(0)}
                      </div>
                      {user.fullName}
                    </td>
                    <td className="p-4 text-[#7A746C]">{user.email}</td>
                    <td className="p-4 text-[#A09890]">{user.phone}</td>
                    <td className="p-4 font-mono font-bold text-[#8A6A25]">
                      {user.referralCode || "-"}
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4 pr-6 text-right">
                      {user.email === "admin@ashanti.com" ? (
                        <span className="text-[10px] text-[#A09890] font-bold uppercase tracking-wider">
                          Primary Admin Lock
                        </span>
                      ) : (
                        <Select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="w-28 py-1.5 px-2 text-[10px]"
                        >
                          <option value="client">Client</option>
                          <option value="referrer">Referrer</option>
                          <option value="advisor">Advisor</option>
                          <option value="admin">Admin</option>
                        </Select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
