export type UserRole = "client" | "referrer" | "advisor" | "admin";

export type ApplicationStage =
  | "profile_complete"
  | "appointment_pending"
  | "appointment_completed"
  | "worksheet_review"
  | "quotes_preparing"
  | "options_ready"
  | "product_selected"
  | "completed";

export interface StageInfo {
  key: ApplicationStage;
  step: number;
  label: string;
  description: string;
  icon: string;
}


export type QuoteStatus =
  | "requested"
  | "received"
  | "under_review"
  | "presented"
  | "selected"
  | "rejected";

export type CommissionStatus = "pending" | "confirmed" | "paid";

export type DocumentType =
  | "pension_worksheet"
  | "appointment_letter"
  | "quotation"
  | "policy_document";

export interface Profile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  referralCode?: string;
}

export type UserProfile = Profile;


export interface Application {
  id: string;
  clientId: string;
  stage: ApplicationStage;
  worksheetUrl?: string;
  assignedAdvisorId?: string;
  referrerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  applicationId: string;
  clientId: string;
  signedDocumentUrl?: string;
  signedAt: string;
  ipAddress: string;
  signatureImageUrl: string; // Base64 signature image
}

export interface Quote {
  id: string;
  applicationId: string;
  provider: string;
  productType: string;
  productName: string;
  premium: number;
  benefits: string[];
  expectedReturns: number;
  terms: string;
  requestDate: string;
  status: QuoteStatus;
  requestedBy: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  clientId: string;
  applicationId: string;
  status: "pending" | "active" | "converted";
  rewardAmount: number;
  clientName: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  applicationId: string;
  premium: number;
  grossCommission: number;
  tax: number;
  netCommission: number;
  clientCashback: number;
  ashantiPool: number;
  referralPayout: number;
  ashantiRetention: number;
  status: CommissionStatus;
  createdAt: string;
}

export interface Document {
  id: string;
  applicationId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  logoUrl?: string;
  active: boolean;
}
