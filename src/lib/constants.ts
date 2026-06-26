// ============================================================
// Ashanti Pension Advisory — Constants & Configuration
// ============================================================

import type { StageInfo, ApplicationStage, QuoteStatus } from './types';

// ---- Brand Colors (matching ashantipension.com) ----
export const BRAND = {
  green: {
    900: '#094029',
    800: '#0C5535',
    700: '#0F6B42',
    600: '#148F58',
    500: '#19A76A',
    400: '#3DBC84',
    300: '#6DD1A3',
    200: '#A3E4C5',
    100: '#D1F2E2',
    50: '#ECFAF2',
  },
  gold: {
    600: '#A37F35',
    500: '#C49A45',
    400: '#D4AF5F',
    300: '#E0C37D',
    200: '#EBD7A3',
    100: '#F5EBD1',
    50: '#FBF6EC',
  },
  cream: '#F9F6F0',
  creamDark: '#F3EFE9',
} as const;

// ---- Application Stages (ordered) ----
export const APPLICATION_STAGES: StageInfo[] = [
  {
    key: 'profile_complete',
    step: 1,
    label: 'Profile Complete',
    description: 'Your profile information has been submitted.',
    icon: 'UserCheck',
  },
  {
    key: 'appointment_pending',
    step: 2,
    label: 'Ashanti Appointment',
    description: 'Sign the agent appointment letter to appoint Ashanti.',
    icon: 'FileSignature',
  },
  {
    key: 'appointment_completed',
    step: 3,
    label: 'Appointment Completed',
    description: 'Ashanti is now your official pension agent.',
    icon: 'ShieldCheck',
  },
  {
    key: 'worksheet_review',
    step: 4,
    label: 'Worksheet Review',
    description: 'Our advisors are reviewing your pension worksheet.',
    icon: 'FileSearch',
  },
  {
    key: 'quotes_preparing',
    step: 5,
    label: 'Quotes Being Prepared',
    description: 'Ashanti is requesting quotations from insurance providers.',
    icon: 'Send',
  },
  {
    key: 'options_ready',
    step: 6,
    label: 'Options Ready',
    description: 'Review and compare your pension options.',
    icon: 'BarChart3',
  },
  {
    key: 'product_selected',
    step: 7,
    label: 'Product Selected',
    description: 'Your preferred pension product has been selected.',
    icon: 'CheckCircle2',
  },
  {
    key: 'completed',
    step: 8,
    label: 'Completed',
    description: 'Policy issued. Congratulations on securing your future!',
    icon: 'Trophy',
  },
];

export const STAGE_ORDER: ApplicationStage[] = APPLICATION_STAGES.map((s) => s.key);

export function getStageIndex(stage: ApplicationStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function isStageComplete(current: ApplicationStage, check: ApplicationStage): boolean {
  return getStageIndex(current) > getStageIndex(check);
}

export function isStageCurrent(current: ApplicationStage, check: ApplicationStage): boolean {
  return current === check;
}

// ---- Quote Status Colors ----
export const QUOTE_STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bg: string }> = {
  requested: { label: 'Requested', color: '#C49A45', bg: '#FBF6EC' },
  received: { label: 'Received', color: '#148F58', bg: '#ECFAF2' },
  under_review: { label: 'Under Review', color: '#2563EB', bg: '#EFF6FF' },
  presented: { label: 'Presented', color: '#7C3AED', bg: '#F5F3FF' },
  selected: { label: 'Selected', color: '#094029', bg: '#D1F2E2' },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
};

// ---- Advisor Pipeline Columns ----
export const PIPELINE_STAGES: { key: ApplicationStage; label: string }[] = [
  { key: 'profile_complete', label: 'New Applications' },
  { key: 'appointment_pending', label: 'Awaiting Appointment' },
  { key: 'appointment_completed', label: 'Appointment Signed' },
  { key: 'worksheet_review', label: 'Worksheet Review' },
  { key: 'quotes_preparing', label: 'Quotation Requests' },
  { key: 'options_ready', label: 'Quotes Received' },
  { key: 'product_selected', label: 'Awaiting Decision' },
  { key: 'completed', label: 'Completed Policies' },
];

// ---- Commission Rates ----
export const COMMISSION_RATES = {
  grossRate: 0.03,       // 3% of premium
  taxRate: 0.30,         // 30% of gross
  clientShareRate: 0.50, // 50% of net
  ashantiShareRate: 0.50,// 50% of net
  referralRate: 0.10,    // 10% of ashanti pool
} as const;

// ---- Navigation Items per Role ----
export const NAV_ITEMS = {
  client: [
    { href: '/client', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/client/appointment', label: 'Appointment', icon: 'FileSignature' },
    { href: '/client/worksheet', label: 'Worksheet', icon: 'FileText' },
    { href: '/client/quotes', label: 'My Quotes', icon: 'BarChart3' },
    { href: '/client/documents', label: 'Documents', icon: 'FolderOpen' },
  ],
  referrer: [
    { href: '/referrer', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/referrer/referrals', label: 'Referrals', icon: 'Users' },
    { href: '/referrer/earnings', label: 'Earnings', icon: 'Wallet' },
  ],
  advisor: [
    { href: '/advisor', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/advisor/clients', label: 'Clients', icon: 'Users' },
    { href: '/advisor/quotes', label: 'Quotes', icon: 'FileText' },
    { href: '/advisor/commissions', label: 'Commissions', icon: 'Wallet' },
  ],
  admin: [
    { href: '/admin', label: 'Overview', icon: 'LayoutDashboard' },
    { href: '/admin/users', label: 'Users', icon: 'Users' },
    { href: '/admin/applications', label: 'Applications', icon: 'FolderOpen' },
    { href: '/admin/commissions', label: 'Commissions', icon: 'Wallet' },
    { href: '/admin/providers', label: 'Providers', icon: 'Building2' },
  ],
} as const;

// ---- App Config ----
export const APP_CONFIG = {
  name: 'Ashanti Pension Advisory',
  shortName: 'Ashanti Pension',
  description: 'Expert pension advisory and referral platform',
  url: 'https://app.ashantipension.com',
  currency: 'KES',
  currencyLocale: 'en-KE',
} as const;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(APP_CONFIG.currencyLocale, {
    style: 'currency',
    currency: APP_CONFIG.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
