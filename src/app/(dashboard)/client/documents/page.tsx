"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile, Document } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { ArrowLeft, FolderDown, FileCheck, FileSignature, Award, FileSpreadsheet } from "lucide-react";

export default function DocumentVaultPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = MockStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const apps = MockStore.getApplications();
      const clientApp = apps.find((a) => a.clientId === user.id);
      if (clientApp) {
        setApp(clientApp);
        
        // Fetch all documents matching this application
        const allDocs = MockStore.getDocuments();
        const clientDocs = allDocs.filter((d) => d.applicationId === clientApp.id);
        setDocs(clientDocs);
      }
    }
    setLoading(false);
  }, []);

  const getDocIcon = (type: string) => {
    switch (type) {
      case "appointment_letter":
        return <FileSignature className="w-5 h-5 text-[#8A6A25]" />;
      case "pension_worksheet":
        return <FileSpreadsheet className="w-5 h-5 text-[#094029]" />;
      case "policy_document":
        return <Award className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-[#7A746C]" />;
    }
  };

  const getDocTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-[family-name:var(--font-body)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#094029] border-t-transparent" />
        <span className="text-[0.6875rem] font-bold text-[#7A746C] uppercase tracking-[0.12em] mt-3">Loading vault...</span>
      </div>
    );
  }

  if (!currentUser || !app) {
    return <div className="text-center py-10 font-[family-name:var(--font-body)] text-xs text-[#A09890] font-bold uppercase tracking-wider">Details missing...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/client")}
          className="inline-flex items-center gap-1.5 text-[#A09890] hover:text-[#094029] text-[0.6875rem] font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Overview
        </button>
        <span className="text-[10px] text-[#A09890] font-bold uppercase tracking-widest font-[family-name:var(--font-heading)]">
          Total Documents: {docs.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1714] leading-tight">
          Document Vault
        </h1>
        <p className="text-xs text-[#7A746C] leading-relaxed">
          Access your digital files, signed authorization letters, and finalized policy portfolios.
        </p>
      </div>

      {docs.length === 0 ? (
        <Card variant="flat" className="p-8 text-center flex flex-col items-center gap-3 py-16">
          <FolderDown className="w-12 h-12 text-[#A09890]" />
          <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-[#1A1714] uppercase tracking-wider">No Documents Uploaded</h3>
          <p className="text-xs text-[#7A746C] max-w-xs leading-relaxed">
            Once you sign your appointment letter or upload pension statements, the documents will be stored securely in this folder.
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <Card key={doc.id} variant="default" className="hover:-translate-y-0.5 transition-transform duration-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 bg-[#F8F6F3] border border-[#EAE7E0]/60 rounded-xl flex items-center justify-center flex-shrink-0">
                    {getDocIcon(doc.type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-[#A09890] font-[family-name:var(--font-heading)] tracking-wider uppercase">
                      {getDocTypeLabel(doc.type)}
                    </span>
                    <h4 className="text-xs font-bold text-[#1A1714] truncate font-[family-name:var(--font-heading)] uppercase tracking-wider max-w-[200px] mt-1">
                      {doc.fileName}
                    </h4>
                    <span className="text-[9px] text-[#A09890] mt-0.5">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <a
                  href={doc.fileUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading ${doc.fileName}... (Simulated download file URL)`);
                  }}
                  className="w-9 h-9 bg-[#F0EDE8] hover:bg-[#094029] hover:text-white text-[#4A4540] rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 border border-[#C8C2BA]/25"
                  title="Download File"
                >
                  <FolderDown className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
