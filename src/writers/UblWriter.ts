/**
 * UblWriter.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import AbstractWriter from './AbstractWriter';
import Document from '../entity/Document';
import { XMLBuilder } from 'fast-xml-parser';
import { formatNumber } from '../helpers';

export default class UblWriter extends AbstractWriter {
  write(document: Document): string {
    const builder = new XMLBuilder({
      attributeNamePrefix: 'attr_',
      ignoreAttributes: false,
      format: false,
      suppressEmptyNode: true,
    });

    const xmlNamespaces = Object.keys(document.xmlNamespaces || {}).reduce(
      (acc, ns) => ({ ...acc, [`attr_${ns}`]: document.xmlNamespaces[ns] }),
      {},
    );

    const json = {
      '?xml': { attr_version: '1.0', attr_encoding: 'UTF-8' },
      Invoice: {
        ...xmlNamespaces,
        'cbc:CustomizationID':
          'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
        'cbc:ProfileID': 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
        'cbc:ID': document.id.toPrimitive(),
        'cbc:IssueDate': document.issueDate?.toPrimitive(),
        'cbc:DueDate': document.dueDate?.toPrimitive(),
        'cbc:InvoiceTypeCode': document.type?.toPrimitive(),
        'cbc:Note': document.notes,
        'cbc:DocumentCurrencyCode': document.currency?.toPrimitive(),
        'cbc:AccountingCost': document.buyerAccountingReference,
        'cbc:BuyerReference': document.buyerReference,
        'cac:OrderReference': {
          'cbc:ID': document.purchaseOrderReference,
        },
        'cac:BillingReference': document.precedingInvoiceReference?.map(
          (reference) => ({
            'cac:InvoiceDocumentReference': {
              'cbc:ID': reference.id,
              'cbc:IssueDate': reference.issueDate?.toPrimitive(),
            },
          }),
        ),
        'cac:ContractDocumentReference': {
          'cbc:ID': document.contractReference,
        },
        'cac:AdditionalDocumentReference': document.attachments?.map(
          (attachment) => ({
            'cbc:ID': attachment.id,
            'cbc:DocumentDescription': attachment.description,
            'cac:Attachment': attachment.content
              ? {
                  'cbc:EmbeddedDocumentBinaryObject': {
                    '#text': btoa(attachment.content.content),
                    attr_mimeCode: attachment.content.mimeCode,
                    attr_filename: attachment.content.filename,
                  },
                }
              : attachment.externalUri
                ? {
                    'cac:ExternalReference': {
                      'cbc:URI': attachment.externalUri,
                    },
                  }
                : undefined,
          }),
        ),
        'cac:AccountingSupplierParty': {
          'cac:Party': {
            'cbc:EndpointID': document.seller?.endpointId.toPrimitive(),
            'cac:PartyIdentification':
              document.seller?.additionalIdentifiers?.map((id) => ({
                'cbc:ID': id,
              })),
            'cac:PartyName': {
              'cbc:Name': document.seller?.tradingName,
            },
            'cac:PostalAddress': {
              'cbc:StreetName': document.seller?.address?.streetName,
              'cbc:AdditionalStreetName':
                document.seller?.address?.addressLines?.[1],
              'cbc:CityName': document.seller?.address?.cityName,
              'cbc:PostalZone': document.seller?.address?.postalZone,
              'cac:Country': {
                'cbc:IdentificationCode': document.seller?.address?.countryCode,
              },
            },
            'cac:PartyTaxScheme': {
              'cbc:CompanyID': document.seller?.vatNumber,
              'cac:TaxScheme': {
                'cbc:ID': 'VAT',
              },
            },
            'cac:PartyLegalEntity': {
              'cbc:RegistrationName': document.seller?.legalName,
              'cbc:CompanyID': document.seller?.companyId,
            },
          },
        },
        'cac:AccountingCustomerParty': {
          'cac:Party': {
            'cbc:EndpointID': document.buyer?.endpointId.toPrimitive(),
            'cac:PartyIdentification':
              document.buyer?.additionalIdentifiers?.map((id) => ({
                'cbc:ID': id,
              })),
            'cac:PartyName': {
              'cbc:Name': document.buyer?.tradingName,
            },
            'cac:PostalAddress': {
              'cbc:StreetName': document.buyer?.address?.streetName,
              'cbc:AdditionalStreetName':
                document.buyer?.address?.addressLines?.[1],
              'cbc:CityName': document.buyer?.address?.cityName,
              'cbc:PostalZone': document.buyer?.address?.postalZone,
              'cac:Country': {
                'cbc:IdentificationCode': document.buyer?.address?.countryCode,
              },
            },
            'cac:PartyTaxScheme': {
              'cbc:CompanyID': document.buyer?.vatNumber,
              'cac:TaxScheme': {
                'cbc:ID': 'VAT',
              },
            },
            'cac:PartyLegalEntity': {
              'cbc:RegistrationName': document.buyer?.legalName,
              'cbc:CompanyID': document.buyer?.companyId,
            },
            'cac:Contact': {
              'cbc:Name': document.buyer?.contactName,
              'cbc:Telephone': document.buyer?.contactPhone,
              'cbc:ElectronicMail': document.buyer?.contactEmail,
            },
          },
        },
        'cac:Delivery': {
          'cbc:ActualDeliveryDate': document.delivery?.date?.toPrimitive(),
          'cac:DeliveryLocation': {
            'cac:Address': {
              'cbc:StreetName': document.delivery?.address?.streetName,
              'cbc:AdditionalStreetName':
                document.delivery?.address?.addressLines?.[1],
              'cbc:CityName': document.delivery?.address?.cityName,
              'cbc:PostalZone': document.delivery?.address?.postalZone,
              'cac:Country': {
                'cbc:IdentificationCode':
                  document.delivery?.address?.countryCode,
              },
            },
          },
        },
        'cac:PaymentMeans': {
          'cbc:PaymentMeansCode': document.payment?.meansCode,
          'cbc:PaymentID': document.payment?.id,
          'cac:PayeeFinancialAccount': {
            'cbc:ID': document.payment?.transfer?.account,
          },
        },
        'cac:TaxTotal': {
          'cbc:TaxAmount': {
            '#text': formatNumber(
              document.taxes?.reduce(
                (sum, tax) => sum + (tax.taxAmount || 0),
                0,
              ),
            ),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cac:TaxSubtotal': document.taxes?.map((tax) => ({
            'cbc:TaxableAmount': {
              '#text': formatNumber(tax.taxableAmount),
              attr_currencyID: tax.currency?.toPrimitive(),
            },
            'cbc:TaxAmount': {
              '#text': formatNumber(tax.taxAmount),
              attr_currencyID: tax.currency?.toPrimitive(),
            },
            'cac:TaxCategory': {
              'cbc:ID': tax.id.toPrimitive().split(':')[0],
              'cbc:Percent': formatNumber(tax.percent),
              'cbc:TaxExemptionReason': tax.taxExemptionReason,
              'cbc:TaxExemptionReasonCode': tax.taxExemptionReasonCode,
              'cac:TaxScheme': {
                'cbc:ID': 'VAT',
              },
            },
          })),
        },
        'cac:LegalMonetaryTotal': {
          'cbc:LineExtensionAmount': {
            '#text': formatNumber(
              document.lines?.reduce(
                (sum, line) => sum + (line.netAmount || 0),
                0,
              ),
            ),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cbc:TaxExclusiveAmount': {
            '#text': formatNumber(
              document.lines?.reduce(
                (sum, line) => sum + (line.netAmount || 0),
                0,
              ),
            ),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cbc:TaxInclusiveAmount': {
            '#text': formatNumber(
              document.lines?.reduce(
                (sum, line) => sum + (line.netAmount || 0),
                0,
              ) +
                document.taxes?.reduce(
                  (sum, tax) => sum + (tax.taxAmount || 0),
                  0,
                ),
            ),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cbc:PayableAmount': {
            '#text': formatNumber(
              document.lines?.reduce(
                (sum, line) => sum + (line.netAmount || 0),
                0,
              ) +
                document.taxes?.reduce(
                  (sum, tax) => sum + (tax.taxAmount || 0),
                  0,
                ),
            ),
            attr_currencyID: document.currency?.toPrimitive(),
          },
        },
        'cac:InvoiceLine': document.lines?.map((line) => ({
          'cbc:ID': line.id.toPrimitive(),
          'cbc:InvoicedQuantity': {
            '#text': formatNumber(line.quantity),
            attr_unitCode: line.unitCode,
          },
          'cbc:LineExtensionAmount': {
            '#text': formatNumber(line.netAmount),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cbc:AccountingCost': line.buyerAccountingReference,
          'cac:InvoicePeriod': {
            'cbc:StartDate': line.periodStart?.toPrimitive(),
            'cbc:EndDate': line.periodEnd?.toPrimitive(),
          },
          'cac:Item': {
            'cbc:Description': line.description,
            'cbc:Name': line.name,
            'cac:SellersItemIdentification': {
              'cbc:ID': line.sellerIdentifier,
            },
            'cac:OriginCountry': {
              'cbc:IdentificationCode': line.originCountryCode,
            },
            'cac:ClassifiedTaxCategory': {
              'cbc:ID': line.tax?.id.toPrimitive().split(':')[0],
              'cbc:Percent': formatNumber(line.tax?.percent),
              'cac:TaxScheme': {
                'cbc:ID': 'VAT',
              },
            },
          },
          'cac:Price': {
            'cbc:PriceAmount': {
              '#text': formatNumber(line.price),
              attr_currencyID: document.currency?.toPrimitive(),
            },
          },
        })),
      },
    };

    return builder.build(json);
  }
}
