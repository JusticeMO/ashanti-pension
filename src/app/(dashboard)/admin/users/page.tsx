"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { Profile, UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Select } from "@/components/ui";
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
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading accounts ledger...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs text-slate-400 font-bold">
          System Accounts: {profiles.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          System User Accounts
        </h1>
        <p className="text-sm text-slate-400">
          Monitor active registration records and adjust operational roles.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-serif">Registry Table</CardTitle>
          <UserCog className="w-4 h-4 text-[#094029]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">User Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Referral Code</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4 pr-6 text-right">Adjust Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {profiles.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-semibold flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                        {user.fullName.charAt(0)}
                      </div>
                      {user.fullName}
                    </td>
                    <td className="p-4 text-slate-500">{user.email}</td>
                    <td className="p-4 text-slate-400">{user.phone}</td>
                    <td className="p-4 font-mono font-bold text-[#A37F35]">
                      {user.referralCode || "-"}
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4 pr-6 text-right">
                      {user.email === "admin@ashanti.com" ? (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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
