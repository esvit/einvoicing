import UblWriter from "./UblWriter";
import Document from "../entity/Document";
import { DocumentId } from "../interface/IDocument";
import DateOnly from "../valueObject/DateOnly";
import DocumentType from "../valueObject/DocumentType";
import CurrencyCode from "../valueObject/CurrencyCode";
import Party from "../valueObject/Party";
import Address from "../valueObject/Address";
import DocumentLine from "../entity/DocumentLine";
import { DocumentLineId } from "../interface/IDocumentLine";
import Identifier from "../valueObject/Identifier";
import Delivery from "../valueObject/Delivery";
import Attribute from "../valueObject/Attribute";
import Payment from "../valueObject/Payment";
import PaymentTransfer from "../valueObject/PaymentTransfer";
import AllowanceCharge from "../valueObject/AllowanceCharge";
import Tax from "../entity/Tax";
import { TaxId } from "../interface/ITax";
import Attachment from "../valueObject/Attachment";
import BinaryObject from "../valueObject/BinaryObject";
import InvoiceReference from "../valueObject/InvoiceReference";
import Payee from "../valueObject/Payee";

describe('UblWriter', () => {
  let ublWriter: UblWriter;

  beforeEach(() => {
    ublWriter = new UblWriter();
  });

  test('write UBL eInvoicing document', () => {
    const document = Document.create({
      id: new DocumentId('12345'),
      issueDate: DateOnly.create("2019-01-25"),
      dueDate: DateOnly.create("2019-02-24"),
      type: DocumentType.create('380'),
      currency: CurrencyCode.create("DKK"),
      buyerReference: 'n/a',
      buyerAccountingReference: 'n/a',
      purchaseOrderReference: 'PO12345',
      salesOrderReference: 'SO12345',
      tenderOrLotReference: 'TENDER123',
      contractReference: 'CONTRACT123',
      precedingInvoiceReference: [
        InvoiceReference.create({ id: "INV-122", issueDate: DateOnly.create("2021-09-21") }),
        InvoiceReference.create({ id: "INV-123" })
      ],
      attachments: [
        Attachment.create({ id: "INV-123" }),
        Attachment.create({
          description: "A link to an external attachment",
          id: "ATT-4321"
        }),
        Attachment.create({
          content: BinaryObject.create({
            content: "The attachment raw contents",
            filename: "ATT-1234.pdf",
            mimeCode: "application/pdf"
          }),
          id: "ATT-1234"
        })
      ],
      seller: Party.create({
        additionalIdentifiers: ['12345678'],
        companyId: '12345678',
        endpointId: '12345678',
        tradingName: "Company A",
        address: Address.create({
          addressLines: [
            "Street"
          ],
          streetName: 'Street',
          cityName: 'Copenhagen',
          postalZone: '1057',
          countryCode: 'DK'
        }),
        vatNumber: 'DK12345678'
      }),
      buyer: Party.create({
        additionalIdentifiers: ['87654321'],
        companyId: '87654321',
        contactName: "n/a",
        endpointId: '87654321',
        tradingName: "Company B",
        address: Address.create({
          addressLines: [
            "Bjerkåsholmen 125"
          ],
          streetName: 'Bjerkåsholmen 125',
          cityName: 'Slemmestad',
          postalZone: 'NO-3470',
          countryCode: 'DK'
        }),
        vatNumber: 'DK87654321'
      }),
      payee: Payee.create({
        name: "Payee Name",
        companyId: "PAYEE123",
        additionalIdentifiers: ["PAYEEID1", "PAYEEID2"]
      }),
      delivery: Delivery.create({
        date: DateOnly.create('2019-01-25')
      }),
      periodStart: DateOnly.create('2018-09-01'),
      periodEnd: DateOnly.create('2018-09-30'),
      paidAmount: 1000,
      roundingAmount: 0.5,
      lines: [
        DocumentLine.create({
          id: new DocumentLineId('1'),
          quantity: 1,
          unitCode: 'KWH',
          buyerAccountingReference: "n/a",
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
            currency: CurrencyCode.create("DKK"),
            percent: 25,
            taxAmount: 156435.89,
            taxableAmount: 625743.54
          })
        })
      ],
      payment: Payment.create({
        id: "12345667890",
        meansCode: "58",
        transfer: PaymentTransfer.create({ account: "1234567891234" })
      }),
      charges: [
        AllowanceCharge.create({
          amount: 200,
          isCharge: false,
          reasonCode: "95",
          reasonText: "Discount",
          tax: Tax.create({
            id: new TaxId('S', 25),
            currency: CurrencyCode.create("DKK"),
            percent: 25,
            taxAmount: 156435.89,
            taxableAmount: 625743.54
          })
        })
      ],
      taxes: [
        Tax.create({
          id: new TaxId('S', 25),
          currency: CurrencyCode.create("DKK"),
          percent: 25,
          taxAmount: 156435.89,
          taxableAmount: 625743.54
        })
      ]
    });

    const result = ublWriter.write(document);
    expect(result).toContain('"id":"12345"');
    expect(result).toContain('"issueDate":"2019-01-25"');
    expect(result).toContain('"dueDate":"2019-02-24"');
    expect(result).toContain('"type":380');
    expect(result).toContain('"currency":"DKK"');
    expect(result).toContain('"buyerReference":"n/a"');
    expect(result).toContain('"buyerAccountingReference":"n/a"');
    expect(result).toContain('"purchaseOrderReference":"PO12345"');
    expect(result).toContain('"salesOrderReference":"SO12345"');
    expect(result).toContain('"tenderOrLotReference":"TENDER123"');
    expect(result).toContain('"contractReference":"CONTRACT123"');
    expect(result).toContain('"precedingInvoiceReference":[{"id":"INV-122","issueDate":"2021-09-21"},{"id":"INV-123"}]');
    expect(result).toContain('"attachments":[{"id":"INV-123"},{"id":"ATT-4321","description":"A link to an external attachment"},{"id":"ATT-1234","content":{"content":"The attachment raw contents","filename":"ATT-1234.pdf","mimeCode":"application/pdf"}}]');
    expect(result).toContain('"seller":{"additionalIdentifiers":["12345678"],"companyId":"12345678","endpointId":"12345678","tradingName":"Company A","address":{"addressLines":["Street"],"streetName":"Street","cityName":"Copenhagen","postalZone":"1057","countryCode":"DK"},"vatNumber":"DK12345678"}');
    expect(result).toContain('"buyer":{"additionalIdentifiers":["87654321"],"companyId":"87654321","contactName":"n/a","endpointId":"87654321","tradingName":"Company B","address":{"addressLines":["Bjerkåsholmen 125"],"streetName":"Bjerkåsholmen 125","cityName":"Slemmestad","postalZone":"NO-3470","countryCode":"DK"},"vatNumber":"DK87654321"}');
    expect(result).toContain('"payee":{"name":"Payee Name","companyId":"PAYEE123","additionalIdentifiers":["PAYEEID1","PAYEEID2"]}');
    expect(result).toContain('"delivery":{"date":"2019-01-25"}');
    expect(result).toContain('"periodStart":"2018-09-01"');
    expect(result).toContain('"periodEnd":"2018-09-30"');
    expect(result).toContain('"paidAmount":1000');
    expect(result).toContain('"roundingAmount":0.5');
    expect(result).toContain('"lines":[{"id":"1","quantity":1,"unitCode":"KWH","buyerAccountingReference":"n/a","periodStart":"2018-09-01","periodEnd":"2018-09-30","name":"text","description":"text","sellerIdentifier":"12345","originCountryCode":"DK","price":625743.54,"netAmount":625743.54,"tax":{"id":"S:25","currency":"DKK","percent":25,"taxAmount":156435.89,"taxableAmount":625743.54}}]');
    expect(result).toContain('"payment":{"id":"12345667890","meansCode":"58","transfer":{"account":"1234567891234"}}');
    expect(result).toContain('"charges":[{"amount":200,"isCharge":false,"reasonCode":"95","reasonText":"Discount","tax":{"id":"S:25","currency":"DKK","percent":25,"taxAmount":156435.89,"taxableAmount":625743.54}}]');
    expect(result).toContain('"taxes":[{"id":"S:25","currency":"DKK","percent":25,"taxAmount":156435.89,"taxableAmount":625743.54}]');
  });
});
