"use client";

import React, { useEffect, useState } from "react";
import { MockStore } from "@/lib/mockStore";
import { InsuranceProvider } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge, SectionHeader, Alert } from "@/components/ui";
import { Building, ArrowLeft, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setProviders(MockStore.getProviders());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newName.trim()) {
      setError("Please type a provider name");
      return;
    }

    if (providers.some((p) => p.name.toLowerCase() === newName.toLowerCase().trim())) {
      setError("Underwriter already exists");
      return;
    }

    const newProvider: InsuranceProvider = {
      id: "p-" + Math.random().toString(36).substr(2, 9),
      name: newName.trim(),
      active: true,
    };

    const updated = [...providers, newProvider];
    setProviders(updated);
    MockStore.setProviders(updated);
    setNewName("");
  };

  const handleToggleActive = (providerId: string) => {
    const updated = providers.map((p) => {
      if (p.id === providerId) {
        return { ...p, active: !p.active };
      }
      return p;
    });
    setProviders(updated);
    MockStore.setProviders(updated);
  };

  const handleDeleteProvider = (providerId: string) => {
    const updated = providers.filter((p) => p.id !== providerId);
    setProviders(updated);
    MockStore.setProviders(updated);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading providers...</span>
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
      </div>

      <SectionHeader
        overline="System Administration"
        title="Insurance Providers & Underwriters"
        subtitle="Add or activate registered underwriters for quotation allocations."
      />

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Add Provider Card */}
        <Card variant="default" className="md:col-span-4">
          <CardHeader className="flex flex-row items-center gap-2">
            <Plus className="w-4 h-4 text-[#094029]" />
            <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Add Underwriter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProvider} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="providerName">Provider Legal Name</Label>
                <Input
                  id="providerName"
                  type="text"
                  placeholder="e.g. Liberty Insurance"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  error={error ? "true" : undefined}
                />
              </div>

              {error && (
                <Alert variant="error">
                  {error}
                </Alert>
              )}

              <Button type="submit" variant="primary" size="sm" className="w-full">
                Register Provider
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Providers List Card */}
        <Card variant="default" className="md:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#EAE7E0]/60">
            <CardTitle className="text-xs uppercase tracking-wider text-[#4A4540]">Registered Underwriters</CardTitle>
            <Building className="w-4 h-4 text-[#094029]" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F6F3] text-[#7A746C] border-b border-[#EAE7E0]/60 uppercase tracking-widest font-bold font-[family-name:var(--font-heading)]">
                    <th className="p-4 pl-6">Company Name</th>
                    <th className="p-4">Underwriting Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE7E0]/40 font-medium text-[#4A4540]">
                  {providers.map((p) => (
                    <tr key={p.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4 pl-6 font-bold text-[#1A1714] font-[family-name:var(--font-heading)] uppercase tracking-wider flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#A09890]" />
                        {p.name}
                      </td>
                      <td className="p-4">
                        <Badge variant={p.active ? "success" : "default"}>
                          {p.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex gap-2 justify-end items-center">
                          <button
                            onClick={() => handleToggleActive(p.id)}
                            className="p-1.5 text-[#7A746C] hover:text-[#094029] hover:bg-[#F0EDE8] rounded-xl cursor-pointer transition-colors"
                            title={p.active ? "Deactivate" : "Activate"}
                          >
                            {p.active ? (
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-[#A09890]" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteProvider(p.id)}
                            className="p-1.5 text-[#7A746C] hover:text-[#B91C1C] hover:bg-[#FEE2E2]/60 rounded-xl cursor-pointer transition-colors"
                            title="Delete underwriter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
