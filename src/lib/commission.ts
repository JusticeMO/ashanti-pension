export interface CommissionBreakdown {
  premium: number;
  grossCommission: number;
  tax: number;
  netCommission: number;
  clientCashback: number;
  ashantiPool: number;
  referralPayout: number;
  ashantiRetention: number;
}

export function calculateCommission(premium: number): CommissionBreakdown {
  const grossCommission = premium * 0.03;
  const tax = grossCommission * 0.30;
  const netCommission = grossCommission - tax;
  const clientCashback = netCommission * 0.50;
  const ashantiPool = netCommission * 0.50;
  const referralPayout = ashantiPool * 0.10;
  const ashantiRetention = ashantiPool - referralPayout;

  return {
    premium,
    grossCommission: Math.round(grossCommission * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    netCommission: Math.round(netCommission * 100) / 100,
    clientCashback: Math.round(clientCashback * 100) / 100,
    ashantiPool: Math.round(ashantiPool * 100) / 100,
    referralPayout: Math.round(referralPayout * 100) / 100,
    ashantiRetention: Math.round(ashantiRetention * 100) / 100,
  };
}
