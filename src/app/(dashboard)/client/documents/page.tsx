"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MockStore } from "@/lib/mockStore";
import { Application, Profile, Document } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { ArrowLeft, FolderDown, FileCheck, FileSignature, ShieldAlert, Award, FileSpreadsheet } from "lucide-react";

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
        return <FileSignature className="w-6 h-6 text-[#A37F35]" />;
      case "pension_worksheet":
        return <FileSpreadsheet className="w-6 h-6 text-[#094029]" />;
      case "policy_document":
        return <Award className="w-6 h-6 text-emerald-600" />;
      default:
        return <FileCheck className="w-6 h-6 text-slate-500" />;
    }
  };

  const getDocTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").toUpperCase();
  };

  if (loading) {
    return <div className="text-center py-10 font-sans text-sm text-slate-400">Loading document vault...</div>;
  }

  if (!currentUser || !app) {
    return <div className="text-center py-10 font-sans text-sm text-slate-400 font-bold">Details missing...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/client")}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <span className="text-xs text-slate-400 font-bold font-sans">
          Total Documents: {docs.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
          Document Vault
        </h1>
        <p className="text-sm text-slate-400">
          Access your digital files, signed authorization letters, and finalized policy portfolios.
        </p>
      </div>

      {docs.length === 0 ? (
        <Card className="p-8 text-center flex flex-col items-center gap-3 py-16">
          <FolderDown className="w-12 h-12 text-slate-300" />
          <h3 className="font-serif font-bold text-lg text-slate-700">No Documents Uploaded</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-normal font-sans">
            Once you sign your appointment letter or upload pension statements, the documents will be stored securely in this folder.
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <Card key={doc.id} className="hover:-translate-y-0.5 transition-transform duration-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {getDocIcon(doc.type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-400 font-sans tracking-wide uppercase">
                      {getDocTypeLabel(doc.type)}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 truncate font-sans max-w-[200px] mt-0.5">
                      {doc.fileName}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-1">
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
                  className="w-9 h-9 bg-slate-100 hover:bg-[#094029] hover:text-white text-slate-600 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 border border-slate-200/50"
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
