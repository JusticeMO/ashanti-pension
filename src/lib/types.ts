// ============================================================
// Ashanti Pension Advisory & Referral Platform — Type Definitions
// ============================================================

// ---- User & Auth ----
export type UserRole = 'client' | 'referrer' | 'advisor' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  referral_code?: string;
  created_at: string;
  updated_at: string;
}

// ---- Application Lifecycle ----
export type ApplicationStage =
  | 'profile_complete'
  | 'appointment_pending'
  | 'appointment_completed'
  | 'worksheet_review'
  | 'quotes_preparing'
  | 'options_ready'
  | 'product_selected'
  | 'completed';

export interface Application {
  id: string;
  client_id: string;
  stage: ApplicationStage;
  worksheet_url?: string;
  assigned_advisor_id?: string;
  referrer_id?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: UserProfile;
  advisor?: UserProfile;
  referrer?: UserProfile;
}

// ---- Agent Appointment ----
export interface Appointment {
  id: string;
  application_id: string;
  client_id: string;
  signed_document_url?: string;
  signature_image_url?: string;
  signed_at: string;
  ip_address: string;
  terms_version: string;
  created_at: string;
}

// ---- Quote Management ----
export type QuoteStatus =
  | 'requested'
  | 'received'
  | 'under_review'
  | 'presented'
  | 'selected'
  | 'rejected';

export interface Quote {
  id: string;
  application_id: string;
  provider: string;
  provider_logo?: string;
  product_type: string;
  product_name: string;
  premium?: number;
  benefits?: string;
  expected_returns?: string;
  terms?: string;
  request_date: string;
  status: QuoteStatus;
  requested_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ---- Referral System ----
export type ReferralStatus = 'pending' | 'registered' | 'active' | 'converted' | 'paid';

export interface Referral {
  id: string;
  referrer_id: string;
  client_id?: string;
  application_id?: string;
  status: ReferralStatus;
  reward_amount?: number;
  created_at: string;
  // Joined
  client?: UserProfile;
  application?: Application;
}

// ---- Commission Engine ----
export type CommissionStatus = 'pending' | 'confirmed' | 'paid';

export interface Commission {
  id: string;
  application_id: string;
  premium: number;
  gross_commission: number;
  tax: number;
  net_commission: number;
  client_cashback: number;
  ashanti_pool: number;
  referral_payout: number;
  ashanti_retention: number;
  status: CommissionStatus;
  created_at: string;
}

export interface CommissionBreakdown {
  premium: number;
  gross: number;
  tax: number;
  net: number;
  clientCashback: number;
  ashantiPool: number;
  referralPayout: number;
  ashantiRetention: number;
}

// ---- Documents ----
export type DocumentType = 'pension_worksheet' | 'appointment_letter' | 'quotation' | 'policy_document';

export interface Document {
  id: string;
  application_id: string;
  type: DocumentType;
  name: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

// ---- Insurance Providers ----
export interface InsuranceProvider {
  id: string;
  name: string;
  logo_url?: string;
  active: boolean;
}

// ---- Dashboard Stats ----
export interface DashboardStats {
  totalClients: number;
  activeApplications: number;
  pendingAppointments: number;
  quotesInProgress: number;
  completedPolicies: number;
  totalCommission: number;
}

// ---- Pipeline Column ----
export interface PipelineColumn {
  stage: ApplicationStage;
  label: string;
  count: number;
  applications: Application[];
}

// ---- Stage Metadata ----
export interface StageInfo {
  key: ApplicationStage;
  step: number;
  label: string;
  description: string;
  icon: string;
}
