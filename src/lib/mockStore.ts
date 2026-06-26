import {
  Profile,
  Application,
  Appointment,
  Quote,
  Referral,
  Commission,
  Document,
  InsuranceProvider,
  UserRole,
  ApplicationStage,
  QuoteStatus,
  DocumentType,
} from "./types";
import { calculateCommission } from "./commission";

// Helper keys
const KEY_PREFIX = "ashanti_pension_";

// Helper for localStorage
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage`, error);
  }
};

// Seed Data
const defaultProviders: InsuranceProvider[] = [
  { id: "p1", name: "ICEA LION Group", active: true },
  { id: "p2", name: "Britam", active: true },
  { id: "p3", name: "Jubilee Insurance", active: true },
  { id: "p4", name: "Sanlam Kenya", active: true },
  { id: "p5", name: "CIC Insurance Group", active: true },
];

const defaultProfiles: Profile[] = [
  {
    id: "admin-id",
    fullName: "Jane Mwangi",
    phone: "+254 700 111 222",
    email: "admin@ashanti.com",
    role: "admin",
  },
  {
    id: "advisor-id",
    fullName: "David Ochieng",
    phone: "+254 700 333 444",
    email: "advisor@ashanti.com",
    role: "advisor",
  },
  {
    id: "referrer-id",
    fullName: "Grace Mutua",
    phone: "+254 700 555 666",
    email: "referrer@ashanti.com",
    role: "referrer",
    referralCode: "GRACE555",
  },
  {
    id: "client-id",
    fullName: "Peter Kamau",
    phone: "+254 700 777 888",
    email: "client@ashanti.com",
    role: "client",
  },
  {
    id: "client-id-2",
    fullName: "Sarah Wanjiku",
    phone: "+254 711 222 333",
    email: "sarah@example.com",
    role: "client",
  },
];

const defaultApplications: Application[] = [
  {
    id: "app-id-1",
    clientId: "client-id",
    stage: "appointment_pending",
    assignedAdvisorId: "advisor-id",
    referrerId: "referrer-id",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-id-2",
    clientId: "client-id-2",
    stage: "options_ready",
    assignedAdvisorId: "advisor-id",
    referrerId: "referrer-id",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const defaultAppointments: Appointment[] = [
  {
    id: "apt-id-2",
    applicationId: "app-id-2",
    clientId: "client-id-2",
    signedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.100.42",
    signatureImageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  },
];

const defaultQuotes: Quote[] = [
  {
    id: "q-1",
    applicationId: "app-id-2",
    provider: "ICEA LION Group",
    productType: "Personal Pension Plan",
    productName: "ICEA Pension Shield",
    premium: 10000,
    benefits: ["Guaranteed return of 5%", "Flexible top-ups", "Free critical illness rider"],
    expectedReturns: 8.5,
    terms: "Minimum term of 5 years. Penalties apply for early withdrawal.",
    requestDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "presented",
    requestedBy: "advisor-id",
  },
  {
    id: "q-2",
    applicationId: "app-id-2",
    provider: "Britam",
    productType: "Personal Pension Plan",
    productName: "Britam RetireEasy",
    premium: 9500,
    benefits: ["Guaranteed return of 4%", "Life cover inclusion", "Loyalty bonuses every 3 years"],
    expectedReturns: 9.0,
    terms: "Minimum term of 10 years. Max withdrawal limit 20% before age 50.",
    requestDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "presented",
    requestedBy: "advisor-id",
  },
];

const defaultReferrals: Referral[] = [
  {
    id: "ref-1",
    referrerId: "referrer-id",
    clientId: "client-id",
    applicationId: "app-id-1",
    status: "pending",
    rewardAmount: 0,
    clientName: "Peter Kamau",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ref-2",
    referrerId: "referrer-id",
    clientId: "client-id-2",
    applicationId: "app-id-2",
    status: "active",
    rewardAmount: 0,
    clientName: "Sarah Wanjiku",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const defaultDocuments: Document[] = [
  {
    id: "doc-1",
    applicationId: "app-id-2",
    type: "appointment_letter",
    fileName: "Ashanti_Agent_Appointment_Sarah_Wanjiku.pdf",
    fileUrl: "#",
    uploadedBy: "client-id-2",
    uploadedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "doc-2",
    applicationId: "app-id-2",
    type: "pension_worksheet",
    fileName: "Previous_Pension_Statement_ICEA.pdf",
    fileUrl: "#",
    uploadedBy: "client-id-2",
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export class MockStore {
  static getProfiles = () => getStorageItem<Profile[]>("profiles", defaultProfiles);
  static setProfiles = (data: Profile[]) => setStorageItem("profiles", data);

  static getApplications = () => getStorageItem<Application[]>("applications", defaultApplications);
  static setApplications = (data: Application[]) => setStorageItem("applications", data);

  static getAppointments = () => getStorageItem<Appointment[]>("appointments", defaultAppointments);
  static setAppointments = (data: Appointment[]) => setStorageItem("appointments", data);

  static getQuotes = () => getStorageItem<Quote[]>("quotes", defaultQuotes);
  static setQuotes = (data: Quote[]) => setStorageItem("quotes", data);

  static getReferrals = () => getStorageItem<Referral[]>("referrals", defaultReferrals);
  static setReferrals = (data: Referral[]) => setStorageItem("referrals", data);

  static getCommissions = () => getStorageItem<Commission[]>("commissions", []);
  static setCommissions = (data: Commission[]) => setStorageItem("commissions", data);

  static getDocuments = () => getStorageItem<Document[]>("documents", defaultDocuments);
  static setDocuments = (data: Document[]) => setStorageItem("documents", data);

  static getProviders = () => getStorageItem<InsuranceProvider[]>("providers", defaultProviders);
  static setProviders = (data: InsuranceProvider[]) => setStorageItem("providers", data);

  static getCurrentUser = (): Profile | null => {
    return getStorageItem<Profile | null>("current_user", null);
  };

  static setCurrentUser = (user: Profile | null) => {
    setStorageItem("current_user", user);
  };

  // Auth Operations
  static login(email: string): { success: boolean; user?: Profile; error?: string } {
    const profiles = this.getProfiles();
    const user = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase().trim());
    if (user) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: "Invalid credentials. Try admin@ashanti.com, advisor@ashanti.com, referrer@ashanti.com, or client@ashanti.com" };
  }

  static logout() {
    this.setCurrentUser(null);
  }

  static register(data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    referrerCode?: string;
  }): { success: boolean; user?: Profile; error?: string } {
    const profiles = this.getProfiles();
    
    // Check if email already registered
    if (profiles.some((p) => p.email.toLowerCase() === data.email.toLowerCase().trim())) {
      return { success: false, error: "Email is already registered" };
    }

    const newProfile: Profile = {
      id: "u-" + Math.random().toString(36).substr(2, 9),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      referralCode: data.role === "referrer" ? "REF" + Math.random().toString(36).substr(2, 5).toUpperCase() : undefined,
    };

    profiles.push(newProfile);
    this.setProfiles(profiles);

    // If client, create a new Application automatically
    if (data.role === "client") {
      const apps = this.getApplications();
      let referrerId: string | undefined;

      if (data.referrerCode) {
        const referrer = profiles.find(
          (p) => p.referralCode?.toUpperCase() === data.referrerCode?.toUpperCase()
        );
        if (referrer) {
          referrerId = referrer.id;
        }
      }

      const newApp: Application = {
        id: "app-" + Math.random().toString(36).substr(2, 9),
        clientId: newProfile.id,
        stage: "profile_complete",
        assignedAdvisorId: "advisor-id", // Auto-assign to default advisor
        referrerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      apps.push(newApp);
      this.setApplications(apps);

      // Create Referral entry if referred
      if (referrerId) {
        const refs = this.getReferrals();
        const newRef: Referral = {
          id: "ref-" + Math.random().toString(36).substr(2, 9),
          referrerId,
          clientId: newProfile.id,
          applicationId: newApp.id,
          status: "pending",
          rewardAmount: 0,
          clientName: newProfile.fullName,
          createdAt: new Date().toISOString(),
        };
        refs.push(newRef);
        this.setReferrals(refs);
      }
    }

    this.setCurrentUser(newProfile);
    return { success: true, user: newProfile };
  }

  // Application flow operations
  static appointAgent(
    applicationId: string,
    signatureImage: string,
    ipAddress: string
  ): { success: boolean; appointment?: Appointment; error?: string } {
    const apps = this.getApplications();
    const appIndex = apps.findIndex((a) => a.id === applicationId);
    if (appIndex === -1) return { success: false, error: "Application not found" };

    const app = apps[appIndex];
    if (app.stage !== "appointment_pending" && app.stage !== "profile_complete") {
      return { success: false, error: "Appointment letter not pending in current stage" };
    }

    // Create appointment
    const appointments = this.getAppointments();
    const newApt: Appointment = {
      id: "apt-" + Math.random().toString(36).substr(2, 9),
      applicationId,
      clientId: app.clientId,
      signedAt: new Date().toISOString(),
      ipAddress,
      signatureImageUrl: signatureImage,
    };
    appointments.push(newApt);
    this.setAppointments(appointments);

    // Add signed letter to documents
    const docs = this.getDocuments();
    const profiles = this.getProfiles();
    const clientName = profiles.find((p) => p.id === app.clientId)?.fullName || "Client";
    docs.push({
      id: "doc-" + Math.random().toString(36).substr(2, 9),
      applicationId,
      type: "appointment_letter",
      fileName: `Ashanti_Agent_Appointment_${clientName.replace(/\s+/g, "_")}.pdf`,
      fileUrl: "#",
      uploadedBy: app.clientId,
      uploadedAt: new Date().toISOString(),
    });
    this.setDocuments(docs);

    // Update app stage
    app.stage = "appointment_completed";
    app.updatedAt = new Date().toISOString();
    apps[appIndex] = app;
    this.setApplications(apps);

    // Update referral status to active if exists
    const referrals = this.getReferrals();
    const refIndex = referrals.findIndex((r) => r.applicationId === applicationId);
    if (refIndex !== -1) {
      referrals[refIndex].status = "active";
      this.setReferrals(referrals);
    }

    return { success: true, appointment: newApt };
  }

  static uploadWorksheet(
    applicationId: string,
    fileName: string,
    metadata: { prevProvider?: string; prevValue?: number; note?: string }
  ): { success: boolean; document?: Document; error?: string } {
    const apps = this.getApplications();
    const appIndex = apps.findIndex((a) => a.id === applicationId);
    if (appIndex === -1) return { success: false, error: "Application not found" };

    const app = apps[appIndex];
    
    // Add worksheet document
    const docs = this.getDocuments();
    const newDoc: Document = {
      id: "doc-" + Math.random().toString(36).substr(2, 9),
      applicationId,
      type: "pension_worksheet",
      fileName: fileName || "Pension_Worksheet.pdf",
      fileUrl: "#",
      uploadedBy: app.clientId,
      uploadedAt: new Date().toISOString(),
    };
    docs.push(newDoc);
    this.setDocuments(docs);

    // Update stage to worksheet_review
    app.stage = "worksheet_review";
    app.updatedAt = new Date().toISOString();
    apps[appIndex] = app;
    this.setApplications(apps);

    return { success: true, document: newDoc };
  }

  // Advisor operations
  static advanceStage(applicationId: string, newStage: ApplicationStage): { success: boolean; error?: string } {
    const apps = this.getApplications();
    const appIndex = apps.findIndex((a) => a.id === applicationId);
    if (appIndex === -1) return { success: false, error: "Application not found" };

    const app = apps[appIndex];

    // IMPORTANT BUSINESS GATES:
    // 1. Cannot prepare quotes or present quotes before appointment is completed
    if (
      (newStage === "quotes_preparing" || newStage === "options_ready" || newStage === "product_selected" || newStage === "completed") &&
      app.stage !== "appointment_completed" &&
      app.stage !== "worksheet_review" &&
      app.stage !== "quotes_preparing" &&
      app.stage !== "options_ready" &&
      app.stage !== "product_selected"
    ) {
      // Check if they signed
      const apts = this.getAppointments();
      const hasSigned = apts.some((a) => a.applicationId === applicationId);
      if (!hasSigned) {
        return {
          success: false,
          error: "CRITICAL GATING RULE: Client must appoint Ashanti as their pension agent before advisory and quotation work can proceed.",
        };
      }
    }

    app.stage = newStage;
    app.updatedAt = new Date().toISOString();
    apps[appIndex] = app;
    this.setApplications(apps);

    return { success: true };
  }

  static createQuoteRequest(data: {
    applicationId: string;
    provider: string;
    productType: string;
    productName: string;
    premium: number;
    benefits: string[];
    expectedReturns: number;
    terms: string;
    advisorId: string;
  }): { success: boolean; quote?: Quote; error?: string } {
    // GATE: check if client has appointed Ashanti
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === data.applicationId);
    if (!app) return { success: false, error: "Application not found" };

    const appointments = this.getAppointments();
    const hasSigned = appointments.some((a) => a.applicationId === data.applicationId);
    if (!hasSigned) {
      return {
        success: false,
        error: "CRITICAL GATING RULE: The client must sign the Ashanti Agent Appointment letter before you can request or add pension quotations.",
      };
    }

    const quotes = this.getQuotes();
    const newQuote: Quote = {
      id: "q-" + Math.random().toString(36).substr(2, 9),
      applicationId: data.applicationId,
      provider: data.provider,
      productType: data.productType,
      productName: data.productName,
      premium: data.premium,
      benefits: data.benefits,
      expectedReturns: data.expectedReturns,
      terms: data.terms,
      requestDate: new Date().toISOString(),
      status: "requested",
      requestedBy: data.advisorId,
    };
    quotes.push(newQuote);
    this.setQuotes(quotes);

    // Auto update stage to quotes_preparing
    if (app.stage === "appointment_completed" || app.stage === "worksheet_review") {
      this.advanceStage(data.applicationId, "quotes_preparing");
    }

    return { success: true, quote: newQuote };
  }

  static updateQuoteStatus(quoteId: string, status: QuoteStatus): { success: boolean; error?: string } {
    const quotes = this.getQuotes();
    const quoteIndex = quotes.findIndex((q) => q.id === quoteId);
    if (quoteIndex === -1) return { success: false, error: "Quote not found" };

    const quote = quotes[quoteIndex];
    quote.status = status;
    quotes[quoteIndex] = quote;
    this.setQuotes(quotes);

    // If a quote becomes "presented", and the application is in "quotes_preparing" stage, we can transition it
    if (status === "presented") {
      const apps = this.getApplications();
      const app = apps.find((a) => a.id === quote.applicationId);
      if (app && app.stage === "quotes_preparing") {
        this.advanceStage(quote.applicationId, "options_ready");
      }
    }

    return { success: true };
  }

  // Client Quote Selection & Selection Action
  static selectQuote(applicationId: string, quoteId: string): { success: boolean; error?: string } {
    const quotes = this.getQuotes();
    const appQuotes = quotes.filter((q) => q.applicationId === applicationId);
    if (appQuotes.length === 0) return { success: false, error: "No quotes found for this application" };

    // Set other quotes to rejected, this one to selected
    let targetQuote: Quote | undefined;
    const updatedQuotes = quotes.map((q) => {
      if (q.applicationId === applicationId) {
        if (q.id === quoteId) {
          targetQuote = q;
          return { ...q, status: "selected" as QuoteStatus };
        } else {
          return { ...q, status: "rejected" as QuoteStatus };
        }
      }
      return q;
    });

    if (!targetQuote) return { success: false, error: "Selected quote not found" };
    this.setQuotes(updatedQuotes);

    // Create policy document entry
    const docs = this.getDocuments();
    docs.push({
      id: "doc-" + Math.random().toString(36).substr(2, 9),
      applicationId,
      type: "policy_document",
      fileName: `Policy_Schedule_${targetQuote.provider.replace(/\s+/g, "_")}.pdf`,
      fileUrl: "#",
      uploadedBy: "advisor-id",
      uploadedAt: new Date().toISOString(),
    });
    this.setDocuments(docs);

    // Trigger Commission Generation
    const commissions = this.getCommissions();
    const breakdown = calculateCommission(targetQuote.premium);
    const newCommission: Commission = {
      id: "com-" + Math.random().toString(36).substr(2, 9),
      applicationId,
      premium: targetQuote.premium,
      grossCommission: breakdown.grossCommission,
      tax: breakdown.tax,
      netCommission: breakdown.netCommission,
      clientCashback: breakdown.clientCashback,
      ashantiPool: breakdown.ashantiPool,
      referralPayout: breakdown.referralPayout,
      ashantiRetention: breakdown.ashantiRetention,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    commissions.push(newCommission);
    this.setCommissions(commissions);

    // Update referrals payout if referred
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app && app.referrerId) {
      const referrals = this.getReferrals();
      const refIndex = referrals.findIndex((r) => r.applicationId === applicationId);
      if (refIndex !== -1) {
        referrals[refIndex].status = "converted";
        referrals[refIndex].rewardAmount = breakdown.referralPayout;
        this.setReferrals(referrals);
      }
    }

    // Advance stage to product_selected
    this.advanceStage(applicationId, "product_selected");

    return { success: true };
  }

  // Admin / General Functions
  static confirmCommission(commissionId: string): { success: boolean; error?: string } {
    const commissions = this.getCommissions();
    const idx = commissions.findIndex((c) => c.id === commissionId);
    if (idx === -1) return { success: false, error: "Commission record not found" };

    commissions[idx].status = "confirmed";
    this.setCommissions(commissions);

    // Also advance app to completed
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === commissions[idx].applicationId);
    if (app) {
      this.advanceStage(app.id, "completed");
    }

    return { success: true };
  }

  static payCommission(commissionId: string): { success: boolean; error?: string } {
    const commissions = this.getCommissions();
    const idx = commissions.findIndex((c) => c.id === commissionId);
    if (idx === -1) return { success: false, error: "Commission record not found" };

    commissions[idx].status = "paid";
    this.setCommissions(commissions);

    return { success: true };
  }
}
