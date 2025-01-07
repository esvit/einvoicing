import UblReader from './UblReader';
import {
  DEFAULT_CUSTOMIZATION_ID,
  DEFAULT_PROFILE_ID,
  DocumentId,
} from '../interface/IDocument';
import DateOnly from '../valueObject/DateOnly';
import DocumentType from '../valueObject/DocumentType';
import CurrencyCode from '../valueObject/CurrencyCode';
import Party from '../valueObject/Party';
import Address from '../valueObject/Address';
import DocumentLine from '../entity/DocumentLine';
import { DocumentLineId } from '../interface/IDocumentLine';
import Identifier from '../valueObject/Identifier';
import Delivery from '../valueObject/Delivery';
import Attribute from '../valueObject/Attribute';
import Payment from '../valueObject/Payment';
import PaymentTransfer from '../valueObject/PaymentTransfer';
import AllowanceCharge from '../valueObject/AllowanceCharge';
import Tax from '../entity/Tax';
import { TaxId } from '../interface/ITax';
import Attachment from '../valueObject/Attachment';
import BinaryObject from '../valueObject/BinaryObject';
import InvoiceReference from '../valueObject/InvoiceReference';
import Payee from '../valueObject/Payee';
import ListIdentifier from '../valueObject/ListIdentifier';
import Contact from '../valueObject/Contact';
import TaxRegistration from '../valueObject/TaxRegistration';
import Quantity from '../valueObject/Quantity';

describe('UblReader', () => {
  let ublReader: UblReader;

  beforeEach(() => {
    ublReader = new UblReader();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('readFromFile', () => {
    // examples from https://github.com/ConnectingEurope/eInvoicing-EN16931/tree/master/ubl/examples
    test('bis3_invoice_negativ.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/bis3_invoice_negativ.xml',
      );
      const vat = Tax.create({
        id: new TaxId('S', 25),
        currency: CurrencyCode.create('DKK'),
        percent: 25,
        taxAmount: -156435.89,
        taxableAmount: -625743.54,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        id: new DocumentId('12345'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        dueDate: DateOnly.create('2019-02-24'),
        issueDate: DateOnly.create('2019-01-25'),
        periodStart: DateOnly.create('2018-09-01'),
        periodEnd: DateOnly.create('2018-09-30'),
        currency: CurrencyCode.create('DKK'),
        buyerReference: 'n/a',
        buyerAccountingReference: 'n/a',
        notes: 'text',
        type: DocumentType.create('380'),
        payment: Payment.create({
          id: '12345667890',
          meansCode: '58',
          transfer: PaymentTransfer.create({ account: '1234567891234' }),
        }),
        buyer: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '87654321', scheme: '0184' }),
          ],
          companyId: Identifier.create({ id: '87654321', scheme: '0184' }),
          contact: Contact.create({ name: 'n/a' }),
          endpointId: Identifier.create({ id: '87654321', scheme: '0184' }),
          tradingName: 'Company B',
          legalName: 'Company B',
          address: Address.create({
            addressLines: ['Bjerkåsholmen 125'],
            streetName: 'Bjerkåsholmen 125',
            cityName: 'Slemmestad',
            postalZone: 'NO-3470',
            countryCode: 'DK',
          }),
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'DK87654321' }),
            }),
          ],
        }),
        purchaseOrderReference: Identifier.create({ id: 'n/a' }),
        seller: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '12345678', scheme: '0184' }),
          ],
          companyId: Identifier.create({ id: '12345678', scheme: '0184' }),
          endpointId: Identifier.create({ id: '12345678', scheme: '0184' }),
          tradingName: 'Company A',
          legalName: 'Company A',
          address: Address.create({
            addressLines: ['Street'],
            streetName: 'Street',
            cityName: 'Copenhagen',
            postalZone: '1057',
            countryCode: 'DK',
          }),
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'DK12345678' }),
            }),
          ],
        }),
        contractReference: Identifier.create({
          id: '12345',
        }),
        taxes: [vat],
        delivery: Delivery.create({
          date: DateOnly.create('2019-01-25'),
          address: Address.create({
            cityName: 'Copenhagen',
            countryCode: 'DK',
            postalZone: '1057',
            streetName: 'Street',
            addressLines: ['Street'],
          }),
        }),
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            quantity: -1,
            unitCode: 'KWH',
            buyerAccountingReference: 'n/a',
            periodStart: DateOnly.create('2018-09-01'),
            periodEnd: DateOnly.create('2018-09-30'),
            name: 'text',
            description: 'text',
            sellerIdentifier: Identifier.create({ id: '12345' }),
            originCountryCode: 'DK',
            price: 625743.54,
            netAmount: -625743.54,
            tax: vat,
          }),
        ],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });
    test('bis3_invoice_positive.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/bis3_invoice_positive.xml',
      );
      const vat = Tax.create({
        id: new TaxId('S', 25),
        currency: CurrencyCode.create('DKK'),
        percent: 25,
        taxAmount: 156435.89,
        taxableAmount: 625743.54,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        id: new DocumentId('12345'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        dueDate: DateOnly.create('2019-02-24'),
        issueDate: DateOnly.create('2019-01-25'),
        periodStart: DateOnly.create('2018-09-01'),
        periodEnd: DateOnly.create('2018-09-30'),
        currency: CurrencyCode.create('DKK'),
        buyerReference: 'n/a',
        buyerAccountingReference: 'n/a',
        notes: 'text',
        type: DocumentType.create('380'),
        payment: Payment.create({
          id: '12345667890',
          meansCode: '58',
          transfer: PaymentTransfer.create({ account: '1234567891234' }),
        }),
        buyer: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '87654321', scheme: '0184' }),
          ],
          companyId: Identifier.create({ id: '87654321', scheme: '0184' }),
          contact: Contact.create({ name: 'n/a' }),
          endpointId: Identifier.create({ id: '87654321', scheme: '0184' }),
          tradingName: 'Company B',
          legalName: 'Company B',
          address: Address.create({
            addressLines: ['Bjerkåsholmen 125'],
            streetName: 'Bjerkåsholmen 125',
            cityName: 'Slemmestad',
            postalZone: 'NO-3470',
            countryCode: 'DK',
          }),
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'DK87654321' }),
            }),
          ],
        }),
        purchaseOrderReference: Identifier.create({ id: 'n/a' }),
        seller: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '12345678', scheme: '0184' }),
          ],
          companyId: Identifier.create({ id: '12345678', scheme: '0184' }),
          endpointId: Identifier.create({ id: '12345678', scheme: '0184' }),
          tradingName: 'Company A',
          legalName: 'Company A',
          address: Address.create({
            addressLines: ['Street'],
            streetName: 'Street',
            cityName: 'Copenhagen',
            postalZone: '1057',
            countryCode: 'DK',
          }),
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'DK12345678' }),
            }),
          ],
        }),
        contractReference: Identifier.create({
          id: '12345',
        }),
        taxes: [vat],
        delivery: Delivery.create({
          date: DateOnly.create('2019-01-25'),
          address: Address.create({
            cityName: 'Copenhagen',
            countryCode: 'DK',
            postalZone: '1057',
            streetName: 'Street',
            addressLines: ['Street'],
          }),
        }),
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            quantity: 1,
            unitCode: 'KWH',
            buyerAccountingReference: 'n/a',
            periodStart: DateOnly.create('2018-09-01'),
            periodEnd: DateOnly.create('2018-09-30'),
            name: 'text',
            description: 'text',
            sellerIdentifier: Identifier.create({ id: '12345' }),
            originCountryCode: 'DK',
            price: 625743.54,
            netAmount: 625743.54,
            tax: vat,
          }),
        ],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });
    test('ft_g2g_td01_con_allegato_bonifico_e_split_payment.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/ft_g2g_td01_con_allegato_bonifico_e_split_payment.xml',
      );
      const vat = Tax.create({
        id: new TaxId('B', 22),
        currency: CurrencyCode.create('EUR'),
        percent: 22,
        taxAmount: 274.12,
        taxableAmount: 1246,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.attachments[0].toPrimitive().content.toPrimitive()).toEqual(
        {
          content: expect.any(String),
          filename: 'mappatura_ubl_sdi.pdf',
          mimeCode: 'application/pdf',
        },
      );
      expect(result.toPrimitive()).toEqual({
        attachments: [expect.any(Attachment)],
        id: new DocumentId('1316/85'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        issueDate: DateOnly.create('2020-02-13'),
        type: DocumentType.create('380'),
        payment: Payment.create({
          meansCode: '30',
          terms: 'D.LGS. 231/2002 S.M.I',
          transfer: PaymentTransfer.create({
            account: 'IT64W0100003245243300306301',
            provider: Identifier.create({ id: 'UNCRIT2B' }),
          }),
        }),
        buyer: Party.create({
          endpointId: Identifier.create({ id: 'UFLCTZ', scheme: '0201' }),
          tradingName: 'AZIENDA USL DI MODENA',
          legalName: 'AZIENDA AUSL DI MODENA',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'IT02241850367' }),
            }),
          ],
          address: Address.create({
            addressLines: ['VIA SAN GIOVANNI DEL CANTONE 23'],
            cityName: 'MODENA',
            countryCode: 'IT',
            postalZone: '41121',
            streetName: 'VIA SAN GIOVANNI DEL CANTONE 23',
            subdivision: 'MO',
          }),
        }),
        buyerReference: '110#2020-02-05#ABCDEF',
        currency: CurrencyCode.create('EUR'),
        seller: Party.create({
          endpointId: Identifier.create({ id: 'UF6WX8', scheme: '0201' }),
          tradingName: 'Azienda Unita Sanitaria Locale di Reggio Emilia',
          legalName: 'Azienda Unita Sanitaria Locale di Reggio Emilia',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'IT01598570354' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Via Amendola,2'],
            cityName: 'REGGIO EMILIA',
            countryCode: 'IT',
            postalZone: '42100',
            streetName: 'Via Amendola,2',
            subdivision: 'RE',
          }),
        }),
        taxes: [vat],
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            buyerAccountingReference: 'B09.01.068',
            name: 'EBIXA 5MG/EROGAZIONE SOL. ORALE 50 ML',
            netAmount: 1246,
            price: 62.3,
            quantity: 20,
            sellerIdentifier: Identifier.create({ id: '689910' }),
            unitCode: 'C62',
            tax: vat,
          }),
        ],
        notes: 'Scissione Pagamenti',
        paidAmount: 274.12,
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
          'xmlns:ccts': 'urn:un:unece:uncefact:documentation:2',
          'xmlns:cr': 'http://www.ubl-italia.org/ns/CrossReference',
          'xmlns:ext':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
          'xmlns:qdt':
            'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2',
          'xmlns:udt':
            'urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2',
          'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        },
      });
    });
    test('guide-example1.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/guide-example1.xml',
      );
      const tax = Tax.create({
        id: new TaxId('S', 6),
        currency: CurrencyCode.create('EUR'),
        percent: 6,
        taxAmount: 10.99,
        taxableAmount: 183.23,
      });
      const tax2 = Tax.create({
        id: new TaxId('S', 21),
        currency: CurrencyCode.create('EUR'),
        percent: 21,
        taxAmount: 9.74,
        taxableAmount: 46.37,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        id: new DocumentId('12115118'),
        customizationId: 'urn:cen.eu:en16931:2017',
        issueDate: DateOnly.create('2015-01-09'),
        dueDate: DateOnly.create('2015-01-09'),
        type: DocumentType.create('380'),
        payment: Payment.create({}),
        buyer: Party.create({
          additionalIdentifiers: [Identifier.create({ id: '10202' })],
          contact: Contact.create({ name: 'Dhr. J BLOKKER' }),
          legalName: 'ODIN 59',
          address: Address.create({
            addressLines: ['POSTBUS 367'],
            cityName: 'HEEMSKERK',
            countryCode: 'NL',
            postalZone: '1960 AJ',
            streetName: 'POSTBUS 367',
          }),
        }),
        notes:
          "Alle leveringen zijn franco. Alle prijzen zijn incl. BTW. Betalingstermijn: 14 dagen netto. Prijswijzigingen voorbehouden. Op al onze aanbiedingen, leveringen en overeenkomsten zijn van toepassing in de algemene verkoop en leveringsvoorwaarden. Gedeponeerd bij de K.v.K. te Amsterdam 25-04-'85##Delivery terms",
        currency: CurrencyCode.create('EUR'),
        seller: Party.create({
          companyId: Identifier.create({ id: '57151520' }),
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'NL8200.98.395.B.01' }),
            }),
          ],
          legalName: 'De Koksmaat',
          address: Address.create({
            addressLines: ['Postbus 7l'],
            cityName: 'Velsen-Noord',
            countryCode: 'NL',
            postalZone: '1950 AB',
            streetName: 'Postbus 7l',
          }),
        }),
        taxes: [tax, tax2],
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            name: 'PATAT FRITES 10MM 10KG',
            netAmount: 19.9,
            price: 9.95,
            quantity: 2,
            sellerIdentifier: Identifier.create({ id: '166022' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('2'),
            name: 'PKAAS 50PL. JONG BEL. 1KG',
            netAmount: 9.85,
            price: 9.85,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '661813' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('3'),
            name: 'POT KETCHUP 3 LT',
            netAmount: 8.29,
            price: 8.29,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '438146' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('4'),
            name: 'FRITESSAUS 3 LRR',
            netAmount: 14.46,
            price: 7.23,
            quantity: 2,
            sellerIdentifier: Identifier.create({ id: '438103' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('5'),
            name: 'KOFFIE BLIK 3,5KG SNELF',
            netAmount: 35,
            price: 35,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '666955' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('6'),
            name: 'KOFFIE 3.5 KG BLIK STAND',
            netAmount: 35,
            price: 35,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '664871' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('7'),
            name: 'SUIKERKLONT',
            netAmount: 10.65,
            price: 10.65,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '350257' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('8'),
            name: '1 KG UL BLOKJES',
            netAmount: 1.55,
            price: 1.55,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '350258' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('9'),
            name: 'BLOCKNOTE A5',
            netAmount: 14.37,
            price: 4.79,
            quantity: 3,
            sellerIdentifier: Identifier.create({ id: '999998' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('10'),
            name: 'CHIPS NAT KLEIN ZAKJES',
            netAmount: 8.29,
            price: 8.29,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '740810' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('11'),
            name: 'CHIPS PAP KLEINE ZAKJES',
            netAmount: 16.58,
            price: 8.29,
            quantity: 2,
            sellerIdentifier: Identifier.create({ id: '740829' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('12'),
            name: 'TR KL PAKJES APPELSAP',
            netAmount: 9.95,
            price: 9.95,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '740828' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('13'),
            name: 'PK CHOCOLADEMEL',
            netAmount: 3.3,
            price: 1.65,
            quantity: 2,
            sellerIdentifier: Identifier.create({ id: '740827' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('14'),
            name: 'KRAT BIER',
            netAmount: 10.8,
            price: 10.8,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '999996' }),
            tax: tax2,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('15'),
            name: 'STATIEGELD',
            netAmount: 3.9,
            price: 3.9,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '999995' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('16'),
            name: 'BLEEK 3 X 750 ML',
            netAmount: 7.6,
            price: 3.8,
            quantity: 2,
            sellerIdentifier: Identifier.create({ id: '102172' }),
            tax: tax2,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('17'),
            name: 'WC PAPIER',
            netAmount: 9.34,
            price: 4.67,
            quantity: 2,
            sellerIdentifier: Identifier.create({ id: '999994' }),
            tax: tax2,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('18'),
            name: 'BALPENNEN 50 ST BLAUW',
            netAmount: 18.63,
            price: 18.63,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: '999993' }),
            tax: tax2,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('19'),
            name: 'EM FRITUURVETxºxxx',
            netAmount: 102.12,
            price: 17.02,
            quantity: 6,
            sellerIdentifier: Identifier.create({ id: '999992' }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('20'),
            name: 'FRITUUR VET 10 KG RETOUR',
            netAmount: -109.98,
            price: 18.33,
            quantity: 6,
            sellerIdentifier: Identifier.create({ id: '175137' }),
            tax: tax,
            unitCode: 'EA',
          }),
        ],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
          'xmlns:ccts': 'urn:un:unece:uncefact:documentation:2',
          'xmlns:qdt':
            'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDataTypes-2',
          'xmlns:udt':
            'urn:oasis:names:specification:ubl:schema:xsd:UnqualifiedDataTypes-2',
        },
      });
    });
    test('guide-example2.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/guide-example2.xml',
      );
      const tax = Tax.create({
        id: new TaxId('S', 25),
        currency: CurrencyCode.create('NOK'),
        percent: 25,
        taxAmount: 365.13,
        taxableAmount: 1460.5,
      });
      const tax2 = Tax.create({
        id: new TaxId('S', 15),
        currency: CurrencyCode.create('NOK'),
        percent: 15,
        taxAmount: 0.15,
        taxableAmount: 1,
      });
      const tax3 = Tax.create({
        id: new TaxId('E', 0),
        currency: CurrencyCode.create('NOK'),
        percent: 0,
        taxAmount: 0,
        taxExemptionReason: 'Exempt New Means of Transport',
        taxableAmount: -25,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        attachments: [
          Attachment.create({
            description: 'Timesheet',
            externalUri: 'http://www.suppliersite.eu/sheet001.html',
            id: Identifier.create({ id: 'Doc1' }),
          }),
          Attachment.create({
            description: 'EHF specification',
            id: Identifier.create({ id: 'Doc2' }),
          }),
        ],
        id: new DocumentId('TOSL108'),
        customizationId: 'urn:cen.eu:en16931:2017',
        businessProcess: 'Invoicing on purchase order',
        issueDate: DateOnly.create('2013-06-30'),
        dueDate: DateOnly.create('2013-07-20'),
        taxPointDate: DateOnly.create('2013-06-30'),
        periodStart: DateOnly.create('2013-06-01'),
        periodEnd: DateOnly.create('2013-06-30'),
        type: DocumentType.create('380'),
        payment: Payment.create({
          id: '3434323213231',
          meansCode: '30',
          terms:
            '2 % discount if paid within 2 days Penalty percentage 10% from due date',
          transfer: PaymentTransfer.create({
            account: 'NO9386011117947',
            provider: Identifier.create({ id: 'DNBANOKK' }),
          }),
        }),
        delivery: Delivery.create({
          date: DateOnly.create('2013-06-15'),
          locationId: Identifier.create({
            id: '6754238987643',
            scheme: '0088',
          }),
          address: Address.create({
            cityName: 'DeliveryCity',
            countryCode: 'NO',
            postalZone: '523427',
            streetName: 'Deliverystreet 2',
            addressLines: ['Deliverystreet 2', 'Side door'],
            subdivision: 'RegionD',
          }),
        }),
        notes: 'Ordered in our booth at the convention',
        paidAmount: 1000,
        payee: Payee.create({
          additionalIdentifiers: ['2298740918237'],
          companyId: '989823401',
          name: 'Ebeneser Scrooge AS',
        }),
        buyer: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '3456789012098', scheme: '0088' }),
          ],
          companyId: Identifier.create({ id: '987654321', scheme: '0082' }),
          contact: Contact.create({
            name: 'John Doe',
            email: 'john@buyercompany.no',
            phone: '5121230',
          }),
          legalName: 'The Buyercompany',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'NO987654321MVA' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Anystreet 8', 'Back door'],
            cityName: 'Anytown',
            countryCode: 'NO',
            postalZone: '101',
            streetName: 'Anystreet 8',
            subdivision: 'RegionB',
          }),
        }),
        contractReference: Identifier.create({
          id: 'Contract321',
        }),
        currency: CurrencyCode.create('NOK'),
        purchaseOrderReference: Identifier.create({ id: '123' }),
        seller: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '1238764941386', scheme: '0088' }),
          ],
          companyId: Identifier.create({ id: '123456789', scheme: '0082' }),
          contact: Contact.create({
            name: 'Antonio Salesmacher',
            email: 'antonio@salescompany.no',
            phone: '46211230',
          }),
          legalName: 'Salescompany ltd.',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'NO123456789MVA' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Main street 34', 'Suite 123'],
            cityName: 'Big city',
            countryCode: 'NO',
            postalZone: '303',
            streetName: 'Main street 34',
            subdivision: 'RegionA',
          }),
        }),
        buyerAccountingReference: 'Project cost code 123',
        charges: [
          AllowanceCharge.create({
            amount: 100,
            isCharge: false,
            reasonCode: '71',
            reasonText: 'Promotion discount',
            tax,
          }),
          AllowanceCharge.create({
            amount: 100,
            isCharge: true,
            reasonText: 'Freight',
            tax,
          }),
        ],
        taxes: [tax, tax2, tax3],
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            attributes: [Attribute.create({ name: 'Color', value: 'Black' })],
            baseQuantity: Quantity.create({
              value: 1,
              unitCode: 'EA',
            }),
            buyerAccountingReference: 'BookingCode001',
            charges: [
              AllowanceCharge.create({
                amount: 12,
                isCharge: false,
                reasonText: 'Damage',
              }),
              AllowanceCharge.create({
                amount: 12,
                isCharge: true,
                reasonText: 'Testing',
              }),
            ],
            classificationIdentifiers: [
              ListIdentifier.create({
                id: '65434568',
                scheme: 'STI',
              }),
            ],
            description:
              'Processor: Intel Core 2 Duo SU9400 LV (1.4GHz). RAM: 3MB. Screen\n                1440x900',
            name: 'Laptop computer',
            netAmount: 1273,
            note: 'Scratch on box',
            orderLineReference: Identifier.create({ id: '1' }),
            originCountryCode: 'DE',
            periodStart: DateOnly.create('2013-06-01'),
            periodEnd: DateOnly.create('2013-06-30'),
            price: 1273,
            quantity: 2,
            sellerIdentifier: Identifier.create({ id: 'JB007' }),
            standardIdentifier: Identifier.create({
              id: '1234567890128',
              scheme: '0088',
            }),
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('2'),
            baseQuantity: Quantity.create({ value: 1, unitCode: 'EA' }),
            buyerAccountingReference: 'BookingCode002',
            classificationIdentifiers: [
              ListIdentifier.create({
                id: '65434567',
                scheme: 'STI',
              }),
            ],
            name: 'Returned "Advanced computing" book',
            netAmount: -3.96,
            note: 'Cover is slightly damaged.',
            orderLineReference: Identifier.create({ id: '5' }),
            price: 3.96,
            quantity: -1,
            sellerIdentifier: Identifier.create({ id: 'JB008' }),
            standardIdentifier: Identifier.create({
              id: '1234567890135',
              scheme: '0160',
            }),
            tax: tax2,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('3'),
            buyerAccountingReference: 'BookingCode003',
            baseQuantity: Quantity.create({ value: 1, unitCode: 'EA' }),
            classificationIdentifiers: [
              ListIdentifier.create({
                id: '65434567',
                scheme: 'STI',
              }),
            ],
            name: '"Computing for dummies" book',
            netAmount: 4.96,
            orderLineReference: Identifier.create({ id: '3' }),
            price: 2.48,
            quantity: 2,
            sellerIdentifier: Identifier.create({ id: 'JB009' }),
            standardIdentifier: Identifier.create({
              id: '1234567890135',
              scheme: '0160',
            }),
            tax: tax2,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('4'),
            buyerAccountingReference: 'BookingCode004',
            baseQuantity: Quantity.create({ value: 1, unitCode: 'EA' }),
            classificationIdentifiers: [
              ListIdentifier.create({
                id: '65434565',
                scheme: 'STI',
              }),
            ],
            name: 'Returned IBM 5150 desktop',
            netAmount: -25,
            orderLineReference: Identifier.create({ id: '2' }),
            price: 25,
            quantity: -1,
            sellerIdentifier: Identifier.create({ id: 'JB010' }),
            standardIdentifier: Identifier.create({
              id: '1234567890159',
              scheme: '0160',
            }),
            tax: tax3,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('5'),
            attributes: [Attribute.create({ name: 'Type', value: 'Cat5' })],
            baseQuantity: Quantity.create({ value: 1, unitCode: 'MTR' }),
            classificationIdentifiers: [
              ListIdentifier.create({
                id: '65434564',
                scheme: 'STI',
              }),
            ],
            buyerAccountingReference: 'BookingCode005',
            name: 'Network cable',
            netAmount: 187.5,
            price: 0.75,
            quantity: 250,
            sellerIdentifier: Identifier.create({ id: 'JB011' }),
            standardIdentifier: Identifier.create({
              id: '1234567890166',
              scheme: '0160',
            }),
            tax: tax,
            unitCode: 'MTR',
          }),
        ],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
          'xmlns:ccts': 'urn:un:unece:uncefact:documentation:2',
          'xmlns:qdt':
            'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDataTypes-2',
          'xmlns:udt':
            'urn:oasis:names:specification:ubl:schema:xsd:UnqualifiedDataTypes-2',
        },
      });
    });
    test('guide-example3.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/guide-example3.xml',
      );
      const tax = Tax.create({
        id: new TaxId('S', 25),
        currency: CurrencyCode.create('DKK'),
        percent: 25,
        taxAmount: 225,
        taxableAmount: 900,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        id: new DocumentId('TOSL108'),
        customizationId: 'urn:cen.eu:en16931:2017',
        issueDate: DateOnly.create('2013-04-10'),
        dueDate: DateOnly.create('2013-05-10'),
        periodStart: DateOnly.create('2013-01-01'),
        periodEnd: DateOnly.create('2013-04-01'),
        type: DocumentType.create('380'),
        payment: Payment.create({
          id: 'Payref1',
          meansCode: '30',
          transfer: PaymentTransfer.create({ account: 'DK1212341234123412' }),
        }),
        charges: [
          AllowanceCharge.create({
            amount: 100,
            isCharge: true,
            reasonText: 'Freight charge',
            tax,
          }),
        ],
        buyer: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '5790000435975', scheme: '0088' }),
          ],
          legalName: 'Buyercompany ltd',
          address: Address.create({
            addressLines: ['Anystreet, Building 1'],
            cityName: 'Anytown',
            countryCode: 'DK',
            postalZone: '101',
            streetName: 'Anystreet, Building 1',
          }),
        }),
        notes: 'Contract was established through our website',
        currency: CurrencyCode.create('DKK'),
        contractReference: Identifier.create({ id: 'SUBSCR571' }),
        seller: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '1238764941386', scheme: '0088' }),
          ],
          companyId: Identifier.create({ id: 'DK16356706' }),
          contact: Contact.create({ email: 'antonio@SubscriptionsSeller.dk' }),
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'DK16356706' }),
            }),
          ],
          legalName: 'SubscriptionSeller',
          address: Address.create({
            addressLines: ['Main street 2, Building 4'],
            cityName: 'Big city',
            countryCode: 'DK',
            postalZone: '54321',
            streetName: 'Main street 2, Building 4',
          }),
        }),
        taxes: [tax],
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            description: 'Subscription fee 1st quarter',
            name: 'Paper subscription',
            quantity: 2,
            netAmount: 400,
            price: 800,
            tax: tax,
            unitCode: 'EA',
          }),
          DocumentLine.create({
            id: new DocumentLineId('2'),
            description: 'Subscription fee 1st quarter',
            name: 'Paper subscription',
            netAmount: 400,
            price: 800,
            quantity: 2,
            tax: tax,
            unitCode: 'EA',
          }),
        ],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
          'xmlns:ccts': 'urn:un:unece:uncefact:documentation:2',
          'xmlns:qdt':
            'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDataTypes-2',
          'xmlns:udt':
            'urn:oasis:names:specification:ubl:schema:xsd:UnqualifiedDataTypes-2',
        },
      });
    });
    test('ubl-invoice-2.0-example.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/ubl-invoice-2.0-example.xml',
      );
      const tax = Tax.create({
        id: new TaxId('A', 0),
        currency: CurrencyCode.create('GBP'),
        taxAmount: 17.5,
        taxableAmount: 100,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        id: new DocumentId('A00095678'),
        customizationId:
          'urn:oasis:names:specification:ubl:xpath:Invoice-2.0:sbs-1.0-draft',
        businessProcess:
          'bpid:urn:oasis:names:draft:bpss:ubl-2-sbs-invoice-notification-draft',
        issueDate: DateOnly.create('2005-06-21'),
        dueDate: DateOnly.create('2005-07-21'),
        taxPointDate: DateOnly.create('2005-06-21'),
        type: DocumentType.create('SalesInvoice'),
        payment: Payment.create({
          meansCode: '20',
          terms: 'Payable within 1 calendar month from the invoice date',
          transfer: PaymentTransfer.create({
            account: '12345678',
            name: 'Farthing Purchasing Consortium',
            provider: Identifier.create({ id: '10-26-58' }),
          }),
        }),
        charges: [
          AllowanceCharge.create({
            amount: 10,
            factorAmount: 0.1,
            isCharge: false,
            reasonCode: '17',
          }),
        ],
        buyer: Party.create({
          contact: Contact.create({
            name: 'Mr Fred Churchill',
            email: 'fred@iytcorporation.gov.uk',
            phone: '0127 2653214',
          }),
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: '12356478' }),
              scheme: 'UK VAT',
            }),
          ],
          tradingName: 'IYT Corporation',
          address: Address.create({
            addressLines: ['Avon Way', '56A'],
            cityName: 'Bridgtow',
            countryCode: 'GB',
            postalZone: 'ZZ99 1ZZ',
            streetName: 'Avon Way',
            subdivision: 'Avon',
          }),
        }),
        notes: 'sample',
        purchaseOrderReference: Identifier.create({ id: 'AEG012345' }),
        seller: Party.create({
          contact: Contact.create({
            name: 'Mrs Bouquet',
            email: 'bouquet@fpconsortial.co.uk',
            phone: '0158 1233714',
          }),
          tradingName: 'Consortial',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: '175 269 2355' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Busy Street', '56A'],
            cityName: 'Farthing',
            countryCode: 'GB',
            postalZone: 'AA99 1BB',
            streetName: 'Busy Street',
            subdivision: 'Heremouthshire',
          }),
        }),
        delivery: Delivery.create({
          date: DateOnly.create('2005-06-20'),
          address: Address.create({
            addressLines: ['Avon Way', '56A'],
            cityName: 'Bridgtow',
            countryCode: 'GB',
            postalZone: 'ZZ99 1ZZ',
            streetName: 'Avon Way',
            subdivision: 'Avon',
          }),
        }),
        taxes: [tax],
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('A'),
            baseQuantity: Quantity.create({ value: 1, unitCode: 'KGM' }),
            buyerIdentifier: '6578489',
            description: 'Acme beeswax',
            name: 'beeswax',
            netAmount: 100,
            orderLineReference: Identifier.create({ id: '1' }),
            price: 1,
            quantity: 100,
            sellerIdentifier: Identifier.create({ id: '17589683' }),
            unitCode: 'KGM',
          }),
        ],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });

    // examples from https://github.com/josemmo/einvoicing
    test('peppol-allowance.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/peppol-allowance.xml',
      );
      const vat = Tax.create({
        currency: CurrencyCode.create('EUR'),
        id: new TaxId('S', 25),
        percent: 25,
        taxAmount: 1484.7,
        taxableAmount: 5938.8,
      });
      const exemptTax = Tax.create({
        currency: CurrencyCode.create('EUR'),
        id: new TaxId('E', 0),
        percent: 0,
        taxAmount: 0,
        taxExemptionReason: 'Reason for tax exempt',
        taxableAmount: 1000,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        id: new DocumentId('Snippet1'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        dueDate: DateOnly.create('2017-12-01'),
        issueDate: DateOnly.create('2017-11-13'),
        taxPointDate: DateOnly.create('2017-12-01'),
        periodStart: DateOnly.create('2017-12-01'),
        periodEnd: DateOnly.create('2017-12-31'),
        currency: CurrencyCode.create('EUR'),
        buyerReference: '0150abc',
        buyerAccountingReference: '4025:123:4343',
        notes: 'Please note we have a new phone number: 22 22 22 22',
        type: DocumentType.create('380'),
        paidAmount: 1000,
        buyer: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: '4598375937', scheme: '0002' }),
          ],
          companyId: Identifier.create({ id: '39937423947', scheme: '0183' }),
          contact: Contact.create({
            name: 'Lisa Johnson',
            email: 'lj@buyer.se',
            phone: '23434234',
          }),
          endpointId: Identifier.create({ id: '4598375937', scheme: '0002' }),
          tradingName: 'BuyerTradingName AS',
          legalName: 'Buyer Official Name',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'SE4598375937' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Hovedgatan 32', 'Po box 878'],
            cityName: 'Stockholm',
            countryCode: 'SE',
            postalZone: '456 34',
            streetName: 'Hovedgatan 32',
            subdivision: 'Södermalm',
          }),
        }),
        seller: Party.create({
          additionalIdentifiers: [Identifier.create({ id: '99887766' })],
          companyId: Identifier.create({ id: 'GB983294' }),
          endpointId: Identifier.create({
            id: '7300010000001',
            scheme: '0088',
          }),
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'GB1232434' }),
              scheme: 'VAT',
            }),
            TaxRegistration.create({
              id: Identifier.create({ id: 'SE555555555501' }),
              scheme: 'TAX',
            }),
          ],
          tradingName: 'SupplierTradingName Ltd.',
          legalName: 'SupplierOfficialName Ltd',
          address: Address.create({
            addressLines: ['Main street 1', 'Postbox 123'],
            cityName: 'London',
            countryCode: 'GB',
            postalZone: 'GB 123 EW',
            streetName: 'Main street 1',
          }),
        }),
        delivery: Delivery.create({
          name: 'Delivery party Name',
          date: DateOnly.create('2017-11-01'),
          address: Address.create({
            addressLines: ['Delivery street 2', 'Building 56'],
            cityName: 'Stockholm',
            countryCode: 'SE',
            postalZone: '21234',
            streetName: 'Delivery street 2',
            subdivision: 'Södermalm',
          }),
          locationId: Identifier.create({
            id: '7300010000001',
            scheme: '0088',
          }),
        }),
        payment: Payment.create({
          id: 'Snippet1',
          meansCode: '30',
          meansName: 'Credit transfer',
          terms: 'Payment within 10 days, 2% discount',
          transfer: PaymentTransfer.create({
            account: 'IBAN32423940',
            name: 'AccountName',
            provider: Identifier.create({ id: 'BIC324098' }),
          }),
        }),
        charges: [
          AllowanceCharge.create({
            amount: 200,
            isCharge: false,
            reasonCode: '95',
            reasonText: 'Discount',
            tax: vat,
          }),
          AllowanceCharge.create({
            amount: 1189.8,
            baseAmount: 5949,
            factorAmount: 20,
            isCharge: true,
            reasonCode: 'CG',
            reasonText: 'Cleaning',
            tax: vat,
          }),
        ],
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            quantity: 10,
            unitCode: 'C62',
            buyerAccountingReference: 'Konteringsstreng',
            name: 'item name',
            note: 'Testing note on line level',
            description: 'Description of item',
            sellerIdentifier: Identifier.create({ id: '97iugug876' }),
            originCountryCode: 'NO',
            classificationIdentifiers: [
              ListIdentifier.create({ id: '09348023', scheme: 'SRV' }),
            ],
            price: 410,
            netAmount: 4040,
            tax: vat,
            charges: [
              AllowanceCharge.create({
                amount: 101,
                isCharge: false,
                reasonCode: '95',
                reasonText: 'Discount',
              }),
              AllowanceCharge.create({
                amount: 41,
                baseAmount: 4100,
                factorAmount: 1,
                isCharge: true,
                reasonCode: 'CG',
                reasonText: 'Cleaning',
              }),
            ],
          }),
          DocumentLine.create({
            id: new DocumentLineId('2'),
            quantity: 10,
            baseQuantity: Quantity.create({ value: 2, unitCode: 'C62' }),
            unitCode: 'C62',
            buyerAccountingReference: 'Konteringsstreng',
            periodStart: DateOnly.create('2017-12-01'),
            periodEnd: DateOnly.create('2017-12-05'),
            name: 'item name',
            note: 'Testing note on line level',
            description: 'Description of item',
            sellerIdentifier: Identifier.create({ id: '97iugug876' }),
            orderLineReference: Identifier.create({ id: '124' }),
            attributes: [
              Attribute.create({
                name: 'AdditionalItemName',
                value: 'AdditionalItemValue',
              }),
            ],
            classificationIdentifiers: [
              ListIdentifier.create({ id: '86776', scheme: 'SRV' }),
            ],
            price: 200,
            netAmount: 1000,
            tax: exemptTax,
          }),
          DocumentLine.create({
            id: new DocumentLineId('a-custom-identifier'),
            attributes: [
              Attribute.create({
                name: 'AdditionalItemName',
                value: 'AdditionalItemValue',
              }),
            ],
            quantity: 10,
            unitCode: 'C62',
            buyerAccountingReference: 'Konteringsstreng',
            periodStart: DateOnly.create('2017-12-01'),
            periodEnd: DateOnly.create('2017-12-05'),
            name: 'item name',
            note: 'Testing note on line level',
            description: 'Description of item',
            sellerIdentifier: Identifier.create({ id: '97iugug876' }),
            orderLineReference: Identifier.create({ id: '124' }),
            classificationIdentifiers: [
              ListIdentifier.create({ id: '86776', scheme: 'SRV' }),
            ],
            price: 100,
            netAmount: 909,
            tax: vat,
            charges: [
              AllowanceCharge.create({
                amount: 101,
                isCharge: false,
                reasonCode: '95',
                reasonText: 'Discount',
              }),
              AllowanceCharge.create({
                amount: 10,
                baseAmount: 1000,
                factorAmount: 1,
                isCharge: true,
                reasonCode: 'CG',
                reasonText: 'Charge',
              }),
            ],
          }),
        ],
        taxes: [vat, exemptTax],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });
    test('peppol-base.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/peppol-base.xml',
      );
      const vat = Tax.create({
        currency: CurrencyCode.create('EUR'),
        id: new TaxId('S', 25),
        percent: 25,
        taxAmount: 331.25,
        taxableAmount: 1325,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        id: new DocumentId('Snippet1'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        dueDate: DateOnly.create('2017-12-01'),
        issueDate: DateOnly.create('2017-11-13'),
        precedingInvoiceReference: [
          InvoiceReference.create({
            id: 'INV-122',
            issueDate: DateOnly.create('2021-09-21'),
          }),
          InvoiceReference.create({ id: 'INV-123' }),
        ],
        contractReference: Identifier.create({
          id: '123Contractref',
        }),
        currency: CurrencyCode.create('EUR'),
        attachments: [
          Attachment.create({
            documentTypeCode: 130,
            id: Identifier.create({ id: 'INV-123' }),
          }),
          Attachment.create({
            description: 'A link to an external attachment',
            externalUri: 'https://www.example.com/document.pdf',
            id: Identifier.create({ id: 'ATT-4321' }),
          }),
          Attachment.create({
            content: BinaryObject.create({
              content: 'The attachment raw contents',
              filename: 'ATT-1234.pdf',
              mimeCode: 'application/pdf',
            }),
            id: Identifier.create({ id: 'ATT-1234' }),
          }),
        ],
        buyerReference: '0150abc',
        buyerAccountingReference: '4025:123:4343',
        type: DocumentType.create('380'),
        buyer: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: 'FR23342', scheme: '0002' }),
          ],
          companyId: Identifier.create({ id: '39937423947', scheme: '0183' }),
          contact: Contact.create({
            name: 'Lisa Johnson',
            email: 'lj@buyer.se',
            phone: '23434234',
          }),
          endpointId: Identifier.create({ id: 'FR23342', scheme: '0002' }),
          tradingName: 'BuyerTradingName AS',
          legalName: 'Buyer Official Name',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'SE4598375937' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Hovedgatan 32', 'Po box 878'],
            cityName: 'Stockholm',
            countryCode: 'SE',
            postalZone: '456 34',
            streetName: 'Hovedgatan 32',
          }),
        }),
        purchaseOrderReference: Identifier.create({ id: '854777' }),
        seller: Party.create({
          additionalIdentifiers: [Identifier.create({ id: '99887766' })],
          companyId: Identifier.create({ id: 'GB983294' }),
          endpointId: Identifier.create({
            id: '9482348239847239874',
            scheme: '0088',
          }),
          tradingName: 'SupplierTradingName Ltd.',
          legalName: 'SupplierOfficialName Ltd',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'GB1232434' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Main street 1', 'Postbox 123'],
            cityName: 'London',
            countryCode: 'GB',
            postalZone: 'GB 123 EW',
            streetName: 'Main street 1',
          }),
        }),
        delivery: Delivery.create({
          name: 'Delivery party Name',
          date: DateOnly.create('2017-11-01'),
          locationId: Identifier.create({
            id: '9483759475923478',
            scheme: '0088',
          }),
          address: Address.create({
            addressLines: ['Delivery street 2', 'Building 56'],
            cityName: 'Stockholm',
            countryCode: 'SE',
            postalZone: '21234',
            streetName: 'Delivery street 2',
          }),
        }),
        originatorDocumentReference: Identifier.create({
          id: 'PPID-123',
        }),
        payment: Payment.create({
          id: 'Snippet1',
          meansCode: '30',
          meansName: 'Credit transfer',
          terms: 'Payment within 10 days, 2% discount',
          transfer: PaymentTransfer.create({
            account: 'IBAN32423940',
            name: 'AccountName',
            provider: Identifier.create({ id: 'BIC324098' }),
          }),
        }),
        charges: [
          AllowanceCharge.create({
            amount: 25,
            isCharge: true,
            reasonText: 'Insurance',
            tax: vat,
          }),
        ],
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            quantity: 7,
            unitCode: 'DAY',
            buyerAccountingReference: 'Konteringsstreng',
            name: 'item name',
            orderLineReference: Identifier.create({ id: '123' }),
            description: 'Description of item',
            standardIdentifier: Identifier.create({
              id: '21382183120983',
              scheme: '0088',
            }),
            originCountryCode: 'NO',
            classificationIdentifiers: [
              ListIdentifier.create({ id: '09348023', scheme: 'SRV' }),
            ],
            price: 400,
            netAmount: 2800,
            tax: vat,
          }),
          DocumentLine.create({
            id: new DocumentLineId('2'),
            quantity: -3,
            unitCode: 'DAY',
            name: 'item name 2',
            description: 'Description 2',
            orderLineReference: Identifier.create({ id: '123' }),
            originCountryCode: 'NO',
            standardIdentifier: Identifier.create({
              id: '21382183120983',
              scheme: '0088',
            }),
            classificationIdentifiers: [
              ListIdentifier.create({ id: '09348023', scheme: 'SRV' }),
            ],
            price: 500,
            netAmount: -1500,
            tax: vat,
          }),
        ],
        taxes: [vat],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });
    test('peppol-credit-note.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/peppol-credit-note.xml',
      );
      const vat = Tax.create({
        currency: CurrencyCode.create('EUR'),
        id: new TaxId('S', 25),
        percent: 25,
        taxAmount: 331.25,
        taxableAmount: 1325,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        id: new DocumentId('Snippet1'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        dueDate: DateOnly.create('2017-12-02'),
        issueDate: DateOnly.create('2017-11-13'),
        precedingInvoiceReference: [
          InvoiceReference.create({ id: 'Snippet1' }),
        ],
        notes: 'Please note we have a new phone number: 22 22 22 22',
        currency: CurrencyCode.create('EUR'),
        buyerReference: '0150abc',
        buyerAccountingReference: '4025:123:4343',
        type: DocumentType.create('381'),
        buyer: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: 'FR23342', scheme: '0002' }),
          ],
          companyId: Identifier.create({ id: '39937423947', scheme: '0183' }),
          contact: Contact.create({
            name: 'Lisa Johnson',
            email: 'lj@buyer.se',
            phone: '23434234',
          }),
          endpointId: Identifier.create({ id: 'FR23342', scheme: '0002' }),
          tradingName: 'BuyerTradingName AS',
          legalName: 'Buyer Official Name',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'SE4598375937' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Hovedgatan 32', 'Po box 878'],
            cityName: 'Stockholm',
            countryCode: 'SE',
            postalZone: '456 34',
            streetName: 'Hovedgatan 32',
          }),
        }),
        seller: Party.create({
          additionalIdentifiers: [Identifier.create({ id: '99887766' })],
          companyId: Identifier.create({ id: 'GB983294' }),
          endpointId: Identifier.create({
            id: '9482348239847239874',
            scheme: '0088',
          }),
          tradingName: 'SupplierTradingName Ltd.',
          legalName: 'SupplierOfficialName Ltd',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'GB1232434' }),
            }),
          ],
          address: Address.create({
            addressLines: ['Main street 1', 'Postbox 123'],
            cityName: 'London',
            countryCode: 'GB',
            postalZone: 'GB 123 EW',
            streetName: 'Main street 1',
          }),
        }),
        delivery: Delivery.create({
          name: 'Delivery party Name',
          date: DateOnly.create('2017-11-01'),
          locationId: Identifier.create({
            id: '9483759475923478',
            scheme: '0088',
          }),
          address: Address.create({
            addressLines: ['Delivery street 2', 'Building 56'],
            cityName: 'Stockholm',
            countryCode: 'SE',
            postalZone: '21234',
            streetName: 'Delivery street 2',
          }),
        }),
        payment: Payment.create({
          id: 'Snippet1',
          meansCode: '30',
          meansName: 'Credit transfer',
          terms: 'Payment within 10 days, 2% discount',
          transfer: PaymentTransfer.create({
            account: 'IBAN32423940',
            name: 'AccountName',
            provider: Identifier.create({ id: 'BIC324098' }),
          }),
        }),
        charges: [
          AllowanceCharge.create({
            amount: 25,
            isCharge: true,
            reasonText: 'Insurance',
            tax: vat,
          }),
        ],
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            quantity: 7,
            buyerAccountingReference: 'Konteringsstreng',
            name: 'item name',
            orderLineReference: Identifier.create({ id: '123' }),
            description: 'Description of item',
            standardIdentifier: Identifier.create({
              id: '21382183120983',
              scheme: '0088',
            }),
            originCountryCode: 'NO',
            classificationIdentifiers: [
              ListIdentifier.create({ id: '09348023', scheme: 'SRV' }),
            ],
            price: 400,
            netAmount: 2800,
            tax: vat,
          }),
          DocumentLine.create({
            id: new DocumentLineId('2'),
            quantity: -3,
            name: 'item name 2',
            description: 'Description 2',
            orderLineReference: Identifier.create({ id: '123' }),
            originCountryCode: 'NO',
            standardIdentifier: Identifier.create({
              id: '21382183120983',
              scheme: '0088',
            }),
            classificationIdentifiers: [
              ListIdentifier.create({ id: '09348023', scheme: 'SRV' }),
            ],
            price: 500,
            netAmount: -1500,
            tax: vat,
          }),
        ],
        taxes: [vat],
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });
    test('peppol-rounding.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/peppol-rounding.xml',
      );
      const vat = Tax.create({
        currency: CurrencyCode.create('EUR'),
        id: new TaxId('S', 19),
        percent: 19,
        taxAmount: 1279.45,
        taxableAmount: 6733.95,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        buyer: Party.create({
          address: Address.create({
            addressLines: ['Strada Zebreiou 432'],
            cityName: 'Bacau',
            countryCode: 'RO',
            postalZone: '57433',
            streetName: 'Strada Zebreiou 432',
            subdivision: 'RO-BC',
          }),
          companyId: Identifier.create({ id: 'RO17364910' }),
          legalName: 'POP Alexandra SRL',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'RO17364910' }),
            }),
          ],
        }),
        currency: CurrencyCode.create('EUR'),
        dueDate: DateOnly.create('2022-11-11'),
        id: new DocumentId('SampleForDecimals'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        issueDate: DateOnly.create('2022-11-03'),
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('101'),
            name: 'Test',
            netAmount: 6733.95,
            price: 0.25,
            quantity: 26935.78,
            tax: vat,
            unitCode: 'H87',
          }),
        ],
        payment: Payment.create({ meansCode: '31' }),
        seller: Party.create({
          additionalIdentifiers: [Identifier.create({ id: '12345678' })],
          address: Address.create({
            addressLines: ['Yellow Brick Road'],
            cityName: 'Kuki',
            countryCode: 'RO',
            postalZone: '400001',
            streetName: 'Yellow Brick Road',
            subdivision: 'RO-CJ',
          }),
          companyId: Identifier.create({ id: 'J12/1234/2016' }),
          endpointId: Identifier.create({
            id: 'admin@example.com',
            scheme: 'EM',
          }),
          legalName: 'Test S.r.o',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: '12345678' }),
            }),
          ],
        }),
        taxes: [vat],
        type: DocumentType.create('380'),
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });
    test('peppol-vat-o.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/peppol-vat-o.xml',
      );
      const vat = Tax.create({
        currency: CurrencyCode.create('SEK'),
        id: new TaxId('O', 0),
        taxAmount: 0,
        taxExemptionReason: 'Not subject to VAT',
        taxableAmount: 3200,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        buyer: Party.create({
          address: Address.create({
            addressLines: ['Anystreet 8', 'Back door'],
            cityName: 'Anytown',
            countryCode: 'NO',
            postalZone: '101',
            streetName: 'Anystreet 8',
            subdivision: 'RegionB',
          }),
          legalName: 'The Buyercompany',
          endpointId: Identifier.create({ id: '987654325', scheme: '0192' }),
        }),
        buyerReference: 'test reference',
        currency: CurrencyCode.create('SEK'),
        id: new DocumentId('Vat-O'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        issueDate: DateOnly.create('2018-08-30'),
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            name: 'Road tax',
            description: 'Weight-based tax, vehicles >3000 KGM',
            netAmount: 3200,
            orderLineReference: Identifier.create({ id: '1' }),
            price: 3200,
            quantity: 1,
            sellerIdentifier: Identifier.create({ id: 'RT3000' }),
            tax: vat,
            unitCode: 'EA',
          }),
        ],
        payment: Payment.create({
          meansCode: '30',
          terms: 'Payment within 30 days',
          transfer: PaymentTransfer.create({
            account: 'SE1212341234123412',
            provider: Identifier.create({ id: 'SEXDABCD' }),
          }),
        }),
        seller: Party.create({
          additionalIdentifiers: [Identifier.create({ id: '7300010000001' })],
          address: Address.create({
            addressLines: ['Main street 2, Building 4'],
            cityName: 'Big city',
            countryCode: 'SE',
            postalZone: '54321',
            streetName: 'Main street 2, Building 4',
          }),
          legalName: 'The Sellercompany Incorporated',
          endpointId: Identifier.create({
            id: '7300010000001',
            scheme: '0088',
          }),
        }),
        taxes: [vat],
        type: DocumentType.create('380'),
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });
    test('peppol-vat-s.xml', async () => {
      const result = await ublReader.readFromFile(
        'tests/files/peppol-vat-s.xml',
      );
      const tax1 = Tax.create({
        currency: CurrencyCode.create('EUR'),
        id: new TaxId('S', 25),
        percent: 25,
        taxAmount: 1250,
        taxableAmount: 5000,
      });
      const tax2 = Tax.create({
        currency: CurrencyCode.create('EUR'),
        id: new TaxId('S', 15),
        percent: 15,
        taxAmount: 300,
        taxableAmount: 2000,
      });
      expect(result.validate()).toEqual({ errors: [], warning: [] });
      expect(result.toPrimitive()).toEqual({
        buyer: Party.create({
          additionalIdentifiers: [
            Identifier.create({ id: 'FR23342', scheme: '0002' }),
          ],
          address: Address.create({
            addressLines: ['Hovedgatan 32', 'Po box 878'],
            cityName: 'Stockholm',
            countryCode: 'SE',
            postalZone: '456 34',
            streetName: 'Hovedgatan 32',
          }),
          companyId: Identifier.create({ id: '39937423947', scheme: '0183' }),
          endpointId: Identifier.create({ id: 'FR23342', scheme: '0002' }),
          tradingName: 'BuyerTradingName AS',
          legalName: 'Buyer Official Name',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'SE4598375937' }),
            }),
          ],
        }),
        buyerAccountingReference: '4025:123:4343',
        buyerReference: '0150abc',
        charges: [
          AllowanceCharge.create({
            amount: 100,
            isCharge: false,
            reasonText: 'Discount',
            tax: tax1,
          }),
          AllowanceCharge.create({
            amount: 200,
            isCharge: true,
            reasonText: 'Cleaning',
            tax: tax1,
          }),
        ],
        currency: CurrencyCode.create('EUR'),
        delivery: Delivery.create({
          date: DateOnly.create('2017-11-01'),
          name: 'Delivery party Name',
          locationId: Identifier.create({
            id: '7300010000001',
            scheme: '0088',
          }),
          address: Address.create({
            addressLines: ['Delivery street 2', 'Building 56'],
            cityName: 'Stockholm',
            countryCode: 'SE',
            postalZone: '21234',
            streetName: 'Delivery street 2',
            subdivision: 'Södermalm',
          }),
        }),
        dueDate: DateOnly.create('2017-12-01'),
        id: new DocumentId('Snippet1'),
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        issueDate: DateOnly.create('2017-11-13'),
        lines: [
          DocumentLine.create({
            id: new DocumentLineId('1'),
            buyerAccountingReference: 'Konteringsstreng',
            classificationIdentifiers: [
              ListIdentifier.create({
                id: '09348023',
                scheme: 'SRV',
              }),
            ],

            netAmount: 4000,
            note: 'Testing note on line level',
            orderLineReference: Identifier.create({ id: '123' }),
            originCountryCode: 'NO',
            description: 'Description of item',
            name: 'item name',
            periodEnd: DateOnly.create('2017-12-05'),
            periodStart: DateOnly.create('2017-12-01'),
            price: 400,
            quantity: 10,
            sellerIdentifier: Identifier.create({ id: '97iugug876' }),
            standardIdentifier: Identifier.create({
              id: '7300010000001',
              scheme: '0088',
            }),
            tax: tax1,
            unitCode: 'C62',
          }),
          DocumentLine.create({
            id: new DocumentLineId('2'),
            buyerAccountingReference: 'Konteringsstreng',
            classificationIdentifiers: [
              ListIdentifier.create({
                id: '86776',
                scheme: 'SRV',
              }),
            ],
            description: 'Description of item',
            name: 'item name',
            netAmount: 2000,
            price: 200,
            quantity: 10,
            sellerIdentifier: Identifier.create({ id: '97iugug876' }),
            standardIdentifier: Identifier.create({
              id: '7300010000001',
              scheme: '0088',
            }),
            tax: tax2,
            unitCode: 'C62',
          }),
          DocumentLine.create({
            id: new DocumentLineId('3'),
            attributes: [
              Attribute.create({
                name: 'AdditionalItemName',
                value: 'AdditionalItemValue',
              }),
            ],
            buyerAccountingReference: 'Konteringsstreng',
            classificationIdentifiers: [
              ListIdentifier.create({
                id: '86776',
                scheme: 'SRV',
              }),
            ],
            description: 'Description of item',
            name: 'item name',
            netAmount: 900,
            price: 90,
            quantity: 10,
            sellerIdentifier: Identifier.create({ id: '97iugug876' }),
            standardIdentifier: Identifier.create({
              id: '873649827489',
              scheme: '0160',
            }),
            tax: tax1,
            unitCode: 'C62',
          }),
        ],
        payment: Payment.create({
          id: 'Snippet1',
          meansCode: '30',
          meansName: 'Credit transfer',
          terms: 'Payment within 10 days, 2% discount',
          transfer: PaymentTransfer.create({
            account: 'IBAN32423940',
            name: 'AccountName',
            provider: Identifier.create({ id: 'BIC324098' }),
          }),
        }),
        seller: Party.create({
          additionalIdentifiers: [Identifier.create({ id: '99887766' })],
          address: Address.create({
            addressLines: ['Main street 1', 'Postbox 123'],
            cityName: 'London',
            countryCode: 'GB',
            postalZone: 'GB 123 EW',
            streetName: 'Main street 1',
          }),
          companyId: Identifier.create({ id: 'GB983294' }),
          companyLegalForm: 'AdditionalLegalInformation',
          contact: Contact.create({
            name: 'John Doe',
            email: 'john.doe@foo.bar',
            phone: '9384203984',
          }),
          endpointId: Identifier.create({
            id: '7300010000001',
            scheme: '0088',
          }),
          tradingName: 'SupplierTradingName Ltd.',
          legalName: 'SupplierOfficialName Ltd',
          taxRegistration: [
            TaxRegistration.create({
              id: Identifier.create({ id: 'GB1232434' }),
            }),
          ],
        }),
        taxes: [tax1, tax2],
        type: DocumentType.create('380'),
        xmlNamespaces: {
          xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          'xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          'xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        },
      });
    });
  });

  test('periodFromXmlNode', async () => {
    expect(ublReader.periodFromXmlNode({})).toEqual({
      periodStart: undefined,
      periodEnd: undefined,
    });
    expect(
      ublReader.periodFromXmlNode({
        'cac:InvoicePeriod': {
          'cbc:StartDate': '2018-09-01',
          'cbc:EndDate': '2018-09-30',
        },
      }),
    ).toEqual({
      periodStart: DateOnly.create('2018-09-01'),
      periodEnd: DateOnly.create('2018-09-30'),
    });
  });
});
