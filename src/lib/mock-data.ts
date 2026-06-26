// ============================================================
// Mock Data — Development/Demo Data
// ============================================================
// This file provides realistic demo data for the frontend.
// When the backend is ready, replace these with actual API calls.

import type {
  UserProfile,
  Application,
  Appointment,
  Quote,
  Referral,
  Commission,
  Document,
  InsuranceProvider,
} from './types';

// ---- Users ----
export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr_001',
    full_name: 'James Kamau',
    phone: '+254 712 345 678',
    email: 'james.kamau@email.com',
    role: 'client',
    referral_code: 'JK2024',
    created_at: '2024-11-15T09:00:00Z',
    updated_at: '2024-11-15T09:00:00Z',
  },
  {
    id: 'usr_002',
    full_name: 'Grace Wanjiku',
    phone: '+254 722 987 654',
    email: 'grace.w@email.com',
    role: 'client',
    created_at: '2024-11-20T10:30:00Z',
    updated_at: '2024-11-20T10:30:00Z',
  },
  {
    id: 'usr_003',
    full_name: 'Peter Ochieng',
    phone: '+254 733 111 222',
    email: 'peter.o@email.com',
    role: 'referrer',
    referral_code: 'PO2024',
    created_at: '2024-10-01T08:00:00Z',
    updated_at: '2024-10-01T08:00:00Z',
  },
  {
    id: 'usr_004',
    full_name: 'Sarah Muthoni',
    phone: '+254 700 333 444',
    email: 'sarah.m@ashantipension.com',
    role: 'advisor',
    created_at: '2024-01-01T07:00:00Z',
    updated_at: '2024-01-01T07:00:00Z',
  },
  {
    id: 'usr_005',
    full_name: 'David Njoroge',
    phone: '+254 711 555 666',
    email: 'david.n@ashantipension.com',
    role: 'admin',
    created_at: '2024-01-01T07:00:00Z',
    updated_at: '2024-01-01T07:00:00Z',
  },
  {
    id: 'usr_006',
    full_name: 'Lucy Akinyi',
    phone: '+254 745 777 888',
    email: 'lucy.a@email.com',
    role: 'client',
    created_at: '2024-12-01T11:00:00Z',
    updated_at: '2024-12-01T11:00:00Z',
  },
  {
    id: 'usr_007',
    full_name: 'Brian Kiprop',
    phone: '+254 756 999 000',
    email: 'brian.k@email.com',
    role: 'client',
    created_at: '2024-12-05T14:00:00Z',
    updated_at: '2024-12-05T14:00:00Z',
  },
];

// ---- Applications ----
export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_001',
    client_id: 'usr_001',
    stage: 'options_ready',
    worksheet_url: '/docs/worksheet_001.pdf',
    assigned_advisor_id: 'usr_004',
    referrer_id: 'usr_003',
    created_at: '2024-11-15T09:30:00Z',
    updated_at: '2024-12-10T16:00:00Z',
    client: MOCK_USERS[0],
    advisor: MOCK_USERS[3],
    referrer: MOCK_USERS[2],
  },
  {
    id: 'app_002',
    client_id: 'usr_002',
    stage: 'appointment_pending',
    assigned_advisor_id: 'usr_004',
    created_at: '2024-11-20T11:00:00Z',
    updated_at: '2024-11-20T11:00:00Z',
    client: MOCK_USERS[1],
    advisor: MOCK_USERS[3],
  },
  {
    id: 'app_003',
    client_id: 'usr_006',
    stage: 'worksheet_review',
    worksheet_url: '/docs/worksheet_003.pdf',
    assigned_advisor_id: 'usr_004',
    referrer_id: 'usr_003',
    created_at: '2024-12-01T12:00:00Z',
    updated_at: '2024-12-05T09:00:00Z',
    client: MOCK_USERS[5],
    advisor: MOCK_USERS[3],
    referrer: MOCK_USERS[2],
  },
  {
    id: 'app_004',
    client_id: 'usr_007',
    stage: 'completed',
    worksheet_url: '/docs/worksheet_004.pdf',
    assigned_advisor_id: 'usr_004',
    created_at: '2024-12-05T15:00:00Z',
    updated_at: '2024-12-20T10:00:00Z',
    client: MOCK_USERS[6],
    advisor: MOCK_USERS[3],
  },
  {
    id: 'app_005',
    client_id: 'usr_001',
    stage: 'quotes_preparing',
    worksheet_url: '/docs/worksheet_005.pdf',
    assigned_advisor_id: 'usr_004',
    referrer_id: 'usr_003',
    created_at: '2024-12-10T08:00:00Z',
    updated_at: '2024-12-15T14:00:00Z',
    client: MOCK_USERS[0],
    advisor: MOCK_USERS[3],
    referrer: MOCK_USERS[2],
  },
];

// ---- Quotes ----
export const MOCK_QUOTES: Quote[] = [
  {
    id: 'qt_001',
    application_id: 'app_001',
    provider: 'Jubilee Insurance',
    product_type: 'Individual Pension Plan',
    product_name: 'Jubilee Pension Plus',
    premium: 1000000,
    benefits: 'Guaranteed minimum return of 4% p.a., Life cover 3x annual premium, Tax relief up to KES 20,000/month',
    expected_returns: '8-12% p.a. (based on 10-year historical performance)',
    terms: '10-year minimum tenure, Early withdrawal penalty of 5%, Vesting at 50 years',
    request_date: '2024-12-01T10:00:00Z',
    status: 'presented',
    requested_by: 'usr_004',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-05T14:00:00Z',
  },
  {
    id: 'qt_002',
    application_id: 'app_001',
    provider: 'Britam',
    product_type: 'Individual Pension Plan',
    product_name: 'Britam Retire Smart',
    premium: 1000000,
    benefits: 'Flexible contribution amounts, Access to balanced & equity funds, Free financial planning sessions',
    expected_returns: '9-14% p.a. (balanced fund average)',
    terms: '5-year minimum tenure, No early withdrawal penalty after 5 years',
    request_date: '2024-12-01T10:00:00Z',
    status: 'presented',
    requested_by: 'usr_004',
    created_at: '2024-12-01T10:30:00Z',
    updated_at: '2024-12-05T14:00:00Z',
  },
  {
    id: 'qt_003',
    application_id: 'app_001',
    provider: 'ICEA Lion',
    product_type: 'Individual Pension Plan',
    product_name: 'ICEA Lion Pension Secure',
    premium: 1000000,
    benefits: 'Capital guarantee on contributions, Disability benefit included, Spouse continuation option',
    expected_returns: '7-10% p.a. (conservative fund)',
    terms: '15-year optimal tenure, Partial withdrawal allowed after 10 years',
    request_date: '2024-12-01T10:00:00Z',
    status: 'presented',
    requested_by: 'usr_004',
    created_at: '2024-12-01T11:00:00Z',
    updated_at: '2024-12-05T14:00:00Z',
  },
  {
    id: 'qt_004',
    application_id: 'app_003',
    provider: 'Old Mutual',
    product_type: 'Pension Transfer',
    product_name: 'Old Mutual Greenlight Pension',
    premium: 750000,
    benefits: 'Consolidation of multiple pension funds, Growth fund option, Online portal access',
    expected_returns: '10-15% p.a. (growth fund)',
    terms: '7-year minimum, Flexible top-ups',
    request_date: '2024-12-10T09:00:00Z',
    status: 'requested',
    requested_by: 'usr_004',
    created_at: '2024-12-10T09:00:00Z',
    updated_at: '2024-12-10T09:00:00Z',
  },
];

// ---- Referrals ----
export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'ref_001',
    referrer_id: 'usr_003',
    client_id: 'usr_001',
    application_id: 'app_001',
    status: 'active',
    reward_amount: 1050,
    created_at: '2024-11-15T09:00:00Z',
    client: MOCK_USERS[0],
    application: MOCK_APPLICATIONS[0],
  },
  {
    id: 'ref_002',
    referrer_id: 'usr_003',
    client_id: 'usr_006',
    application_id: 'app_003',
    status: 'active',
    created_at: '2024-12-01T11:00:00Z',
    client: MOCK_USERS[5],
    application: MOCK_APPLICATIONS[2],
  },
  {
    id: 'ref_003',
    referrer_id: 'usr_003',
    client_id: undefined,
    status: 'pending',
    created_at: '2024-12-15T08:00:00Z',
  },
];

// ---- Commissions ----
export const MOCK_COMMISSIONS: Commission[] = [
  {
    id: 'com_001',
    application_id: 'app_004',
    premium: 1000000,
    gross_commission: 30000,
    tax: 9000,
    net_commission: 21000,
    client_cashback: 10500,
    ashanti_pool: 10500,
    referral_payout: 1050,
    ashanti_retention: 9450,
    status: 'confirmed',
    created_at: '2024-12-20T10:00:00Z',
  },
];

// ---- Insurance Providers ----
export const MOCK_PROVIDERS: InsuranceProvider[] = [
  { id: 'prov_001', name: 'Jubilee Insurance', active: true },
  { id: 'prov_002', name: 'Britam', active: true },
  { id: 'prov_003', name: 'ICEA Lion', active: true },
  { id: 'prov_004', name: 'Old Mutual', active: true },
  { id: 'prov_005', name: 'CIC Insurance', active: true },
  { id: 'prov_006', name: 'Madison Insurance', active: true },
  { id: 'prov_007', name: 'Sanlam Kenya', active: true },
  { id: 'prov_008', name: 'Liberty Life', active: true },
];

// ---- Documents ----
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc_001',
    application_id: 'app_001',
    type: 'pension_worksheet',
    name: 'Pension Worksheet - James Kamau.pdf',
    file_url: '/docs/worksheet_001.pdf',
    uploaded_by: 'usr_001',
    uploaded_at: '2024-11-16T10:00:00Z',
  },
  {
    id: 'doc_002',
    application_id: 'app_001',
    type: 'appointment_letter',
    name: 'Agent Appointment Letter - Signed.pdf',
    file_url: '/docs/appointment_001.pdf',
    uploaded_by: 'usr_001',
    uploaded_at: '2024-11-17T14:00:00Z',
  },
  {
    id: 'doc_003',
    application_id: 'app_001',
    type: 'quotation',
    name: 'Jubilee Pension Plus - Quotation.pdf',
    file_url: '/docs/quote_001.pdf',
    uploaded_by: 'usr_004',
    uploaded_at: '2024-12-05T09:00:00Z',
  },
];

// ---- Current logged-in user (for demo) ----
export const CURRENT_USER: UserProfile = MOCK_USERS[0]; // James Kamau (client)
export const CURRENT_ADVISOR: UserProfile = MOCK_USERS[3]; // Sarah Muthoni (advisor)
export const CURRENT_REFERRER: UserProfile = MOCK_USERS[2]; // Peter Ochieng (referrer)
export const CURRENT_ADMIN: UserProfile = MOCK_USERS[4]; // David Njoroge (admin)
