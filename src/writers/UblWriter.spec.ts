import UblWriter from './UblWriter';
import Document from '../entity/Document';
import { DocumentId, DocumentTypes } from '../interface/IDocument';
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
import DKRuleset from '../ruleset/DKRuleset';

describe('UblWriter', () => {
  let ublWriter: UblWriter;

  beforeEach(() => {
    ublWriter = new UblWriter();
  });

  test('write UBL eInvoicing document', async () => {
    const ruleset = new DKRuleset();
    const document = Document.create(DocumentTypes.Invoice, ruleset, {
      id: new DocumentId('12345'),
      issueDate: DateOnly.create('2019-01-25'),
      dueDate: DateOnly.create('2019-02-24'),
      type: DocumentType.create('380'),
      currency: CurrencyCode.create('DKK'),
      buyerReference: 'n/a',
      buyerAccountingReference: 'n/a',
      purchaseOrderReference: Identifier.create({ id: 'PO12345' }),
      salesOrderReference: 'SO12345',
      tenderOrLotReference: 'TENDER123',
      contractReference: Identifier.create({ id: 'CONTRACT123' }),
      precedingInvoiceReference: [
        InvoiceReference.create({
          id: 'INV-122',
          issueDate: DateOnly.create('2021-09-21'),
        }),
        InvoiceReference.create({ id: 'INV-123' }),
      ],
      attachments: [
        Attachment.create({ id: Identifier.create({ id: 'INV-123' }) }),
        Attachment.create({
          description: 'A link to an external attachment',
          id: Identifier.create({ id: 'ATT-4321' }),
          externalUri: 'https://www.example.com/document.pdf',
        }),
        Attachment.create({
          content: BinaryObject.createFromBase64({
            base64: 'VGhlIGF0dGFjaG1lbnQgcmF3IGNvbnRlbnRz',
            filename: 'ATT-1234.pdf',
            mimeCode: 'application/pdf',
          }),
          id: Identifier.create({ id: 'ATT-1234' }),
        }),
      ],
      seller: Party.create({
        additionalIdentifiers: [
          Identifier.create({ id: '12345678', scheme: '0184' }),
        ],
        companyId: Identifier.create({ id: '12345678' }),
        endpointId: Identifier.create({ id: '12345678', scheme: '0088' }),
        tradingName: 'Company A',
        legalName: 'Company A',
        address: Address.create({
          addressLines: ['Street'],
          streetName: 'Street',
          cityName: 'Copenhagen',
          postalZone: '1057',
          countryCode: 'DK',
        }),
        vatNumber: 'DK12345678',
      }),
      buyer: Party.create({
        additionalIdentifiers: [
          Identifier.create({ id: '87654321', scheme: '0012' }),
        ],
        companyId: Identifier.create({ id: '87654321' }),
        contactName: 'n/a',
        endpointId: Identifier.create({ id: '87654321', scheme: '0002' }),
        tradingName: 'Company B',
        legalName: 'Company B',
        address: Address.create({
          addressLines: ['Bjerkåsholmen 125'],
          streetName: 'Bjerkåsholmen 125',
          cityName: 'Slemmestad',
          postalZone: 'NO-3470',
          countryCode: 'DK',
        }),
        vatNumber: 'DK87654321',
      }),
      payee: Payee.create({
        name: 'Payee Name',
        companyId: 'PAYEE123',
        additionalIdentifiers: ['PAYEEID1', 'PAYEEID2'],
      }),
      delivery: Delivery.create({
        date: DateOnly.create('2019-01-25'),
        address: Address.create({
          streetName: 'Street',
          cityName: 'Copenhagen',
          postalZone: '1057',
          countryCode: 'DK',
        }),
      }),
      periodStart: DateOnly.create('2018-09-01'),
      periodEnd: DateOnly.create('2018-09-30'),
      paidAmount: 1000,
      roundingAmount: 0.5,
      lines: [
        DocumentLine.create({
          id: new DocumentLineId('1'),
          classificationIdentifiers: [
            Identifier.create({
              id: '65434568',
              scheme: 'STI',
            }),
          ],
          attributes: [Attribute.create({ name: 'Color', value: 'Black' })],
          quantity: 1,
          unitCode: 'KWH',
          buyerAccountingReference: 'n/a',
          periodStart: DateOnly.create('2018-09-01'),
          periodEnd: DateOnly.create('2018-09-30'),
          name: 'text',
          description: 'text',
          sellerIdentifier: '12345',
          originCountryCode: 'DK',
          price: 625743.54,
          netAmount: 625743.54,
          tax: Tax.create({
            id: new TaxId('S', 25),
            currency: CurrencyCode.create('DKK'),
            percent: 25,
            taxAmount: 156435.89,
            taxableAmount: 625743.54,
          }),
        }),
      ],
      payment: Payment.create({
        id: '12345667890',
        meansCode: '58',
        transfer: PaymentTransfer.create({ account: '1234567891234' }),
      }),
      charges: [
        AllowanceCharge.create({
          amount: 200,
          isCharge: false,
          reasonCode: '95',
          reasonText: 'Discount',
          tax: Tax.create({
            id: new TaxId('S', 25),
            currency: CurrencyCode.create('DKK'),
            percent: 25,
            taxAmount: 156435.89,
            taxableAmount: 625743.54,
          }),
        }),
      ],
      taxes: [
        Tax.create({
          id: new TaxId('S', 25),
          currency: CurrencyCode.create('DKK'),
          percent: 25,
          taxAmount: 156435.89,
          taxableAmount: 625743.54,
        }),
      ],
    });

    const result = ublWriter.write(document);
    await ublWriter.writeToFile(document, 'test.xml');
    expect(result).toContain('<cbc:ID>12345</cbc:ID>');
    expect(result).toContain('<cbc:IssueDate>2019-01-25</cbc:IssueDate>');
    expect(result).toContain('<cbc:DueDate>2019-02-24</cbc:DueDate>');
    expect(result).toContain('<cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>');
    expect(result).toContain(
      '<cbc:DocumentCurrencyCode>DKK</cbc:DocumentCurrencyCode>',
    );
    expect(result).toContain('<cbc:BuyerReference>n/a</cbc:BuyerReference>');
    expect(result).toContain('<cbc:AccountingCost>n/a</cbc:AccountingCost>');
    expect(result).toContain(
      '<cac:OrderReference><cbc:ID>PO12345</cbc:ID></cac:OrderReference>',
    );
    expect(result).toContain(
      '<cac:BillingReference><cac:InvoiceDocumentReference><cbc:ID>INV-122</cbc:ID><cbc:IssueDate>2021-09-21</cbc:IssueDate></cac:InvoiceDocumentReference></cac:BillingReference>',
    );
    expect(result).toContain(
      '<cac:BillingReference><cac:InvoiceDocumentReference><cbc:ID>INV-123</cbc:ID></cac:InvoiceDocumentReference></cac:BillingReference>',
    );
    expect(result).toContain(
      '<cac:ContractDocumentReference><cbc:ID>CONTRACT123</cbc:ID></cac:ContractDocumentReference>',
    );
    expect(result).toContain(
      '<cac:AdditionalDocumentReference><cbc:ID>INV-123</cbc:ID></cac:AdditionalDocumentReference>',
    );
    expect(result).toContain(
      '<cac:AdditionalDocumentReference><cbc:ID>ATT-4321</cbc:ID><cbc:DocumentDescription>A link to an external attachment</cbc:DocumentDescription><cac:Attachment><cac:ExternalReference><cbc:URI>https://www.example.com/document.pdf</cbc:URI></cac:ExternalReference></cac:Attachment></cac:AdditionalDocumentReference>',
    );
    expect(result).toContain(
      '<cac:AdditionalDocumentReference><cbc:ID>ATT-1234</cbc:ID><cac:Attachment><cbc:EmbeddedDocumentBinaryObject mimeCode="application/pdf" filename="ATT-1234.pdf">VGhlIGF0dGFjaG1lbnQgcmF3IGNvbnRlbnRz</cbc:EmbeddedDocumentBinaryObject></cac:Attachment></cac:AdditionalDocumentReference>',
    );
    expect(result).toContain(
      '<cac:AccountingSupplierParty><cac:Party><cbc:EndpointID schemeID="0088">12345678</cbc:EndpointID><cac:PartyIdentification><cbc:ID schemeID="0184">12345678</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>Company A</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>Street</cbc:StreetName><cbc:CityName>Copenhagen</cbc:CityName><cbc:PostalZone>1057</cbc:PostalZone><cac:Country><cbc:IdentificationCode>DK</cbc:IdentificationCode></cac:Country></cac:PostalAddress><cac:PartyTaxScheme><cbc:CompanyID>DK12345678</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>Company A</cbc:RegistrationName><cbc:CompanyID>12345678</cbc:CompanyID></cac:PartyLegalEntity></cac:Party></cac:AccountingSupplierParty>',
    );
    expect(result).toContain(
      '<cac:AccountingCustomerParty><cac:Party><cbc:EndpointID schemeID="0002">87654321</cbc:EndpointID><cac:PartyIdentification><cbc:ID schemeID="0012">87654321</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>Company B</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>Bjerkåsholmen 125</cbc:StreetName><cbc:CityName>Slemmestad</cbc:CityName><cbc:PostalZone>NO-3470</cbc:PostalZone><cac:Country><cbc:IdentificationCode>DK</cbc:IdentificationCode></cac:Country></cac:PostalAddress><cac:PartyTaxScheme><cbc:CompanyID>DK87654321</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>Company B</cbc:RegistrationName><cbc:CompanyID>87654321</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:Name>n/a</cbc:Name></cac:Contact></cac:Party></cac:AccountingCustomerParty>',
    );
    expect(result).toContain(
      '<cac:Delivery><cbc:ActualDeliveryDate>2019-01-25</cbc:ActualDeliveryDate><cac:DeliveryLocation><cac:Address><cbc:StreetName>Street</cbc:StreetName><cbc:CityName>Copenhagen</cbc:CityName><cbc:PostalZone>1057</cbc:PostalZone><cac:Country><cbc:IdentificationCode>DK</cbc:IdentificationCode></cac:Country></cac:Address></cac:DeliveryLocation><cac:DeliveryParty><cac:PartyName/></cac:DeliveryParty></cac:Delivery>',
    );
    expect(result).toContain(
      '<cac:PaymentMeans><cbc:PaymentMeansCode>58</cbc:PaymentMeansCode><cbc:PaymentID>12345667890</cbc:PaymentID><cac:PayeeFinancialAccount><cbc:ID>1234567891234</cbc:ID></cac:PayeeFinancialAccount></cac:PaymentMeans>',
    );
    expect(result).toContain(
      '<cac:TaxTotal><cbc:TaxAmount currencyID="DKK">156435.89</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="DKK">625743.54</cbc:TaxableAmount><cbc:TaxAmount currencyID="DKK">156435.89</cbc:TaxAmount><cac:TaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>25</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal>',
    );
    expect(result).toContain(
      '<cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="DKK">625743.54</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="DKK">625743.54</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="DKK">782179.43</cbc:TaxInclusiveAmount><cbc:PayableAmount currencyID="DKK">782179.43</cbc:PayableAmount></cac:LegalMonetaryTotal>',
    );
    expect(result).toContain(
      '<cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="KWH">1</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="DKK">625743.54</cbc:LineExtensionAmount><cbc:AccountingCost>n/a</cbc:AccountingCost><cac:InvoicePeriod><cbc:StartDate>2018-09-01</cbc:StartDate><cbc:EndDate>2018-09-30</cbc:EndDate></cac:InvoicePeriod><cac:OrderLineReference/><cac:Item><cbc:Description>text</cbc:Description><cbc:Name>text</cbc:Name><cac:SellersItemIdentification><cbc:ID>12345</cbc:ID></cac:SellersItemIdentification><cac:OriginCountry><cbc:IdentificationCode>DK</cbc:IdentificationCode></cac:OriginCountry><cac:ClassifiedTaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>25</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory></cac:Item><cac:Price><cbc:PriceAmount currencyID="DKK">625743.54</cbc:PriceAmount></cac:Price></cac:InvoiceLine>',
    );
  });
});
