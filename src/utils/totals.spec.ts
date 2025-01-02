import UblReader from '../readers/UblReader';
import CurrencyCode from '../valueObject/CurrencyCode';
import { getInvoiceTotals } from './totals';

describe('totals', () => {
  let ublReader: UblReader;

  beforeEach(() => {
    ublReader = new UblReader();
  });

  describe('getInvoiceTotals', () => {
    describe('bis3_invoice_negativ.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/bis3_invoice_negativ.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          currency: CurrencyCode.create('DKK'),
          netAmount: -625743.54,
          payableAmount: -782179.43,
          taxAmount: -156435.89,
          taxCurrency: CurrencyCode.create('DKK'),
          taxExclusiveAmount: -625743.54,
          taxInclusiveAmount: -782179.43,
        });
      });
    });

    describe('bis3_invoice_positive.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/bis3_invoice_positive.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          currency: CurrencyCode.create('DKK'),
          netAmount: 625743.54,
          payableAmount: 782179.43,
          taxAmount: 156435.89,
          taxCurrency: CurrencyCode.create('DKK'),
          taxExclusiveAmount: 625743.54,
          taxInclusiveAmount: 782179.43,
        });
      });
    });

    describe('ft_g2g_td01_con_allegato_bonifico_e_split_payment.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/ft_g2g_td01_con_allegato_bonifico_e_split_payment.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          currency: CurrencyCode.create('EUR'),
          netAmount: 1246.0,
          paidAmount: 274.12,
          payableAmount: 1246.0,
          taxAmount: 274.12,
          taxCurrency: CurrencyCode.create('EUR'),
          taxExclusiveAmount: 1246.0,
          taxInclusiveAmount: 1520.12,
        });
      });
    });

    describe('guide-example1.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/guide-example1.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          currency: CurrencyCode.create('EUR'),
          netAmount: 229.6,
          payableAmount: 250.33,
          taxAmount: 20.73,
          taxCurrency: CurrencyCode.create('EUR'),
          taxExclusiveAmount: 229.6,
          taxInclusiveAmount: 250.33,
        });
      });
    });

    describe('guide-example2.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/guide-example2.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          allowancesAmount: 100,
          chargesAmount: 100,
          currency: CurrencyCode.create('NOK'),
          netAmount: 1436.5,
          paidAmount: 1000,
          payableAmount: 801.78,
          taxAmount: 365.28,
          taxCurrency: CurrencyCode.create('NOK'),
          taxExclusiveAmount: 1436.5,
          taxInclusiveAmount: 1801.78,
        });
      });
    });

    describe('guide-example3.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/guide-example3.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          chargesAmount: 100,
          currency: CurrencyCode.create('DKK'),
          netAmount: 800,
          payableAmount: 1125,
          taxAmount: 225,
          taxCurrency: CurrencyCode.create('DKK'),
          taxExclusiveAmount: 900,
          taxInclusiveAmount: 1125,
        });
      });
    });

    describe('peppol-allowance.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/peppol-allowance.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          allowancesAmount: 200,
          chargesAmount: 1189.8,
          currency: CurrencyCode.create('EUR'),
          netAmount: 5949,
          paidAmount: 1000,
          payableAmount: 7423.5,
          taxAmount: 1484.7,
          taxCurrency: CurrencyCode.create('EUR'),
          taxExclusiveAmount: 6938.8,
          taxInclusiveAmount: 8423.5,
        });
      });
    });

    describe('peppol-base.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/peppol-base.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          chargesAmount: 25,
          currency: CurrencyCode.create('EUR'),
          netAmount: 1300,
          payableAmount: 1656.25,
          taxAmount: 331.25,
          taxCurrency: CurrencyCode.create('EUR'),
          taxExclusiveAmount: 1325,
          taxInclusiveAmount: 1656.25,
        });
      });
    });

    describe('peppol-credit-note.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/peppol-credit-note.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          chargesAmount: 25,
          currency: CurrencyCode.create('EUR'),
          netAmount: 1300,
          payableAmount: 1656.25,
          taxAmount: 331.25,
          taxCurrency: CurrencyCode.create('EUR'),
          taxExclusiveAmount: 1325,
          taxInclusiveAmount: 1656.25,
        });
      });
    });

    describe('peppol-rounding.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/peppol-rounding.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          currency: CurrencyCode.create('EUR'),
          netAmount: 6733.95,
          payableAmount: 8013.4,
          taxAmount: 1279.45,
          taxCurrency: CurrencyCode.create('EUR'),
          taxExclusiveAmount: 6733.95,
          taxInclusiveAmount: 8013.4,
        });
      });
    });

    describe('peppol-vat-o.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/peppol-vat-o.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          currency: CurrencyCode.create('SEK'),
          netAmount: 3200,
          payableAmount: 3200,
          taxAmount: 0,
          taxCurrency: CurrencyCode.create('SEK'),
          taxExclusiveAmount: 3200,
          taxInclusiveAmount: 3200,
        });
      });
    });

    describe('peppol-vat-s.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/peppol-vat-s.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          allowancesAmount: 100,
          chargesAmount: 200,
          currency: CurrencyCode.create('EUR'),
          netAmount: 6900,
          payableAmount: 8550,
          taxAmount: 1550,
          taxCurrency: CurrencyCode.create('EUR'),
          taxExclusiveAmount: 7000,
          taxInclusiveAmount: 8550,
        });
      });
    });

    describe.skip('ubl-invoice-2.0-example.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/ubl-invoice-2.0-example.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          allowancesAmount: 10,
          chargesAmount: 0,
          currency: CurrencyCode.create('GBP'),
          netAmount: 100,
          paidAmount: 0,
          payableAmount: 107.5,
          roundingAmount: 0,
          taxAmount: 10,
          taxCurrency: CurrencyCode.create('GBP'),
          taxExclusiveAmount: 90,
          taxInclusiveAmount: 100,
        });
      });
    });

    describe('ubl-invoice-2.1-example-trivial.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/ubl-invoice-2.1-example-trivial.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toMatchObject({
          currency: undefined,
          netAmount: 100,
          payableAmount: 100,
          taxCurrency: undefined,
          taxExclusiveAmount: 100,
          taxInclusiveAmount: 100,
        });
      });
    });

    describe('ubl-invoice-2.1-example.xml', () => {
      it('should return the correct totals', async () => {
        const document = await ublReader.readFromFile(
          'tests/files/ubl-invoice-2.1-example.xml',
        );

        const totals = getInvoiceTotals(document);

        expect(totals).toEqual({
          allowancesAmount: 100,
          chargesAmount: 100,
          currency: CurrencyCode.create('EUR'),
          netAmount: 1436.5,
          paidAmount: 1000,
          payableAmount: 729,
          roundingAmount: 0.3,
          taxAmount: 292.2,
          taxCurrency: CurrencyCode.create('EUR'),
          taxExclusiveAmount: 1436.5,
          taxInclusiveAmount: 1729,
        });
      });
    });
  });
});
