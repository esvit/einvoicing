import Document from '../entity/Document';
import AllowanceCharge from '../valueObject/AllowanceCharge';
import CurrencyCode from '../valueObject/CurrencyCode';

export interface InvoiceTotals {
  allowancesAmount: number | undefined;
  chargesAmount: number;
  currency: CurrencyCode;
  netAmount: number;
  paidAmount: number;
  payableAmount: number;
  roundingAmount: number | undefined;
  taxAmount: number;
  taxCurrency: CurrencyCode;
  taxExclusiveAmount: number;
  taxInclusiveAmount: number;
}

function round(number: number, precision: number = 2): number {
  const factor = Math.pow(10, precision);

  return Math.round(number * factor) / factor;
}

function getEffectiveAmount(item: AllowanceCharge): number {
  if (item.amount) {
    return item.amount;
  }

  if (item.isPercentage) {
    return item.baseAmount * (item.amount / 100);
  }

  return item.amount;
}

const pick = (
  obj: InvoiceTotals,
  includeMap: Record<keyof InvoiceTotals, boolean>,
): InvoiceTotals => {
  return Object.keys(obj).reduce((acc, key) => {
    if (includeMap[key]) {
      acc[key] = obj[key];
    } else {
      acc[key] = undefined;
    }

    return acc;
  }, {} as InvoiceTotals);
};

export function getInvoiceTotals(document: Document): InvoiceTotals {
  const currency = document.currency;
  const taxCurrency = document.taxCurrency || document.currency;

  const include = {
    allowancesAmount: false,
    chargesAmount: false,
    currency: true,
    netAmount: true,
    paidAmount: false,
    payableAmount: true,
    roundingAmount: false,
    taxAmount: true,
    taxCurrency: true,
    taxExclusiveAmount: true,
    taxInclusiveAmount: true,
  };

  // All the values are initialized to 0, so that operations can be performed on them
  // without having to check if they are undefined.
  const totals: InvoiceTotals = {
    allowancesAmount: 0,
    chargesAmount: 0,
    currency,
    netAmount: 0,
    paidAmount: 0,
    payableAmount: 0,
    roundingAmount: 0,
    taxAmount: 0,
    taxCurrency,
    taxExclusiveAmount: 0,
    taxInclusiveAmount: 0,
  };

  if (typeof document.roundingAmount !== 'undefined') {
    totals.roundingAmount = round(document.roundingAmount);
    include.roundingAmount = true;
  }

  if (typeof document.paidAmount !== 'undefined') {
    totals.paidAmount = round(document.paidAmount || 0.0);
    include.paidAmount = true;
  }

  for (const line of document.lines) {
    const netAmount = round(line.netAmount ?? 0.0);
    totals.netAmount += netAmount;
  }

  totals.netAmount = round(totals.netAmount);

  const allowances = document.charges?.filter((charge) => !charge.isCharge);
  const charges = document.charges?.filter((charge) => charge.isCharge);

  for (const allowance of allowances || []) {
    const allowanceAmount = round(getEffectiveAmount(allowance));
    totals.allowancesAmount += allowanceAmount;
    include.allowancesAmount = true;
  }

  totals.allowancesAmount = round(totals.allowancesAmount);

  for (const charge of charges || []) {
    const chargeAmount = round(getEffectiveAmount(charge));
    totals.chargesAmount += chargeAmount;
    include.chargesAmount = true;
  }

  totals.chargesAmount = round(totals.chargesAmount);

  for (const line of document.taxes || []) {
    const taxAmount = round(line.taxAmount ?? 0.0);
    totals.taxAmount += taxAmount;
  }

  totals.taxAmount = round(totals.taxAmount);

  totals.taxExclusiveAmount = round(
    totals.netAmount - totals.allowancesAmount + totals.chargesAmount,
  );

  totals.taxInclusiveAmount = round(
    totals.taxExclusiveAmount + totals.taxAmount + totals.roundingAmount,
  );

  totals.payableAmount = round(totals.taxInclusiveAmount - totals.paidAmount);

  return pick(totals, include);
}
