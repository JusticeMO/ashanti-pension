import React from "react";
import {
  UserCheck,
  FileSignature,
  ShieldCheck,
  FileSpreadsheet,
  Hourglass,
  FileStack,
  CheckCircle,
  Award,
} from "lucide-react";
import { ApplicationStage } from "@/lib/types";

interface Step {
  stage: ApplicationStage;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

const STEPS: Step[] = [
  {
    stage: "profile_complete",
    label: "Profile Setup Completed",
    description: "Your user profile is active and details recorded.",
    icon: UserCheck,
  },
  {
    stage: "appointment_pending",
    label: "Ashanti Agent Appointment",
    description: "Appoint Ashanti as your official agent to request quotes.",
    icon: FileSignature,
  },
  {
    stage: "appointment_completed",
    label: "Ashanti Appointed as Agent",
    description: "Ashanti has been officially appointed to request quotations.",
    icon: ShieldCheck,
  },
  {
    stage: "worksheet_review",
    label: "Worksheet Review",
    description: "We are reviewing your current pension statement.",
    icon: FileSpreadsheet,
  },
  {
    stage: "quotes_preparing",
    label: "Preparing Quotations",
    description: "Ashanti is acquiring comparative quotes from providers.",
    icon: Hourglass,
  },
  {
    stage: "options_ready",
    label: "Advisory Options Ready",
    description: "Review and compare quotes in your dashboard.",
    icon: FileStack,
  },
  {
    stage: "product_selected",
    label: "Product Selected",
    description: "You selected your preferred option. Preparing policy.",
    icon: CheckCircle,
  },
  {
    stage: "completed",
    label: "Policy Complete",
    description: "Your new pension account is active and commission processed.",
    icon: Award,
  },
];

interface StatusTimelineProps {
  currentStage: ApplicationStage;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStage }) => {
  const getStageIndex = (stage: ApplicationStage) => {
    return STEPS.findIndex((s) => s.stage === stage);
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="bg-white/75 backdrop-blur-[20px] border border-white/90 p-6 rounded-[24px] shadow-[0_8px_32px_rgba(9,64,41,0.05),0_2px_8px_rgba(9,64,41,0.03)] flex flex-col w-full max-w-lg mx-auto font-[family-name:var(--font-body)]">
      <h3 className="text-sm font-bold font-[family-name:var(--font-heading)] text-[#1A1714] mb-6 border-b border-[#EAE7E0]/60 pb-3 uppercase tracking-wider">
        Advisory Progress
      </h3>
      <div className="relative flex flex-col gap-6">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex || currentStage === "completed";
          const isActive = idx === currentIndex && currentStage !== "completed";
          const isPending = idx > currentIndex && currentStage !== "completed";

          const IconComponent = step.icon;

          return (
            <div key={step.stage} className="relative flex gap-4 items-start group">
              {/* Vertical line connector */}
              {idx !== STEPS.length - 1 && (
                <div
                  className={`absolute left-5 top-10 bottom-0 w-[2px] -mb-6 transition-all duration-300 ${
                    isCompleted ? "bg-[#094029]" : "bg-[#EAE7E0]/80"
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Step indicator dot */}
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-[1.5px] transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#094029] border-[#094029] text-white shadow-[0_2px_8px_rgba(9,64,41,0.2)]"
                    : isActive
                    ? "bg-[#C49A45] border-[#C49A45] text-white shadow-[0_0_0_4px_rgba(196,154,69,0.22)] animate-pulse"
                    : "bg-[#F8F6F3] border-[#C8C2BA] text-[#A09890]"
                }`}
                style={{ zIndex: 1 }}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Step Info */}
              <div className="flex flex-col pt-0.5">
                <span
                  className={`text-xs font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider transition-colors duration-200 ${
                    isActive
                      ? "text-[#C49A45]"
                      : isCompleted
                      ? "text-[#094029]"
                      : "text-[#7A746C]"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[11px] text-[#A09890] mt-1 leading-relaxed">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
