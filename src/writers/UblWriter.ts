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
import { computeTotals, formatNumber, omitEmpty } from '../helpers';

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

    const { linesTotal, taxInclusiveAmount, taxExclusiveAmount, chargesTotal } =
      computeTotals(document);

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
        'cac:InvoicePeriod': {
          'cbc:StartDate': document.periodStart?.toPrimitive(),
          'cbc:EndDate': document.periodEnd?.toPrimitive(),
        },
        'cac:OrderReference': {
          'cbc:ID': document.purchaseOrderReference?.toPrimitive(),
        },
        'cac:BillingReference': document.precedingInvoiceReference?.map(
          (reference) => ({
            'cac:InvoiceDocumentReference': {
              'cbc:ID': reference.id,
              'cbc:IssueDate': reference.issueDate?.toPrimitive(),
            },
          }),
        ),
        'cac:OriginatorDocumentReference': {
          'cbc:ID': document.originatorDocumentReference?.toPrimitive(),
        },
        'cac:ContractDocumentReference': {
          'cbc:ID': document.contractReference?.toPrimitive(),
        },
        'cac:AdditionalDocumentReference': document.attachments?.map(
          (attachment) => ({
            'cbc:ID': attachment.id.toPrimitive(),
            'cbc:DocumentTypeCode': attachment.documentTypeCode,
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
            'cbc:EndpointID': document.seller?.endpointId?.toPrimitive(),
            'cac:PartyIdentification':
              document.seller?.additionalIdentifiers?.map((id) => ({
                'cbc:ID': id.toPrimitive(),
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
              'cbc:CountrySubentity': document.seller?.address?.subdivision,
              'cac:Country': {
                'cbc:IdentificationCode': document.seller?.address?.countryCode,
              },
            },
            'cac:PartyTaxScheme': {
              'cbc:CompanyID':
                document.seller?.taxRegistrationId?.companyId.toPrimitive(),
              'cac:TaxScheme': {
                'cbc:ID': document.seller?.taxRegistrationId?.taxScheme,
              },
            },
            'cac:PartyLegalEntity': {
              'cbc:RegistrationName': document.seller?.legalName,
              'cbc:CompanyID': document.seller?.companyId?.toPrimitive(),
              'cbc:CompanyLegalForm': document.seller?.companyLegalForm,
            },
            'cac:Contact': {
              'cbc:Name': document.seller?.contact?.name,
              'cbc:Telephone': document.seller?.contact?.phone,
              'cbc:ElectronicMail': document.seller?.contact?.email,
            },
          },
        },
        'cac:AccountingCustomerParty': {
          'cac:Party': {
            'cbc:EndpointID': document.buyer?.endpointId?.toPrimitive(),
            'cac:PartyIdentification':
              document.buyer?.additionalIdentifiers?.map((id) => ({
                'cbc:ID': id.toPrimitive(),
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
              'cbc:CountrySubentity': document.buyer?.address?.subdivision,
              'cac:Country': {
                'cbc:IdentificationCode': document.buyer?.address?.countryCode,
              },
            },
            'cac:PartyTaxScheme': {
              'cbc:CompanyID':
                document.buyer?.taxRegistrationId?.companyId.toPrimitive(),
              'cac:TaxScheme': {
                'cbc:ID': document.buyer?.taxRegistrationId?.taxScheme,
              },
            },
            'cac:PartyLegalEntity': {
              'cbc:RegistrationName': document.buyer?.legalName,
              'cbc:CompanyID': document.buyer?.companyId?.toPrimitive(),
              'cbc:CompanyLegalForm': document.buyer?.companyLegalForm,
            },
            'cac:Contact': {
              'cbc:Name': document.buyer?.contact?.name,
              'cbc:Telephone': document.buyer?.contact?.phone,
              'cbc:ElectronicMail': document.buyer?.contact?.email,
            },
          },
        },
        'cac:Delivery': {
          'cbc:ActualDeliveryDate': document.delivery?.date?.toPrimitive(),
          'cac:DeliveryLocation': {
            'cbc:ID': document.delivery?.locationId?.toPrimitive(),
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
          'cac:DeliveryParty': {
            'cac:PartyName': {
              'cbc:Name': document.delivery?.name,
            },
          },
        },
        'cac:PaymentMeans': {
          'cbc:PaymentMeansCode': {
            attr_name: document.payment?.meansName,
            '#text': document.payment?.meansCode,
          },
          'cbc:PaymentID': document.payment?.id,
          'cac:PayeeFinancialAccount': {
            'cbc:ID': document.payment?.transfer?.account,
            'cbc:Name': document.payment?.transfer?.name,
            'cac:FinancialInstitutionBranch': {
              'cbc:ID': document.payment?.transfer?.provider?.toPrimitive(),
            },
          },
        },
        'cac:PaymentTerms': {
          'cbc:Note': document.payment?.terms,
        },
        'cac:AllowanceCharge': document.charges?.map((charge) => ({
          'cbc:ChargeIndicator': charge.isCharge,
          'cbc:AllowanceChargeReason': charge.reasonText,
          'cbc:Amount': {
            '#text': formatNumber(charge.amount),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cac:TaxCategory': {
            'cbc:ID': charge.tax?.id?.toPrimitive().split(':')[0],
            'cbc:Percent': formatNumber(charge.tax?.percent),
            'cbc:TaxExemptionReason': charge.tax?.taxExemptionReason,
            'cbc:TaxExemptionReasonCode': charge.tax?.taxExemptionReasonCode,
            'cac:TaxScheme': {
              'cbc:ID': 'VAT',
            },
          },
        })),
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
            '#text': formatNumber(linesTotal),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cbc:TaxExclusiveAmount': {
            '#text': formatNumber(taxExclusiveAmount),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cbc:TaxInclusiveAmount': {
            '#text': formatNumber(taxInclusiveAmount),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cbc:ChargeTotalAmount': {
            '#text': formatNumber(chargesTotal),
            attr_currencyID: document.currency?.toPrimitive(),
          },
          'cbc:PayableAmount': {
            '#text': formatNumber(taxInclusiveAmount),
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
          'cac:OrderLineReference': {
            'cbc:LineID': line.orderLineReference?.toPrimitive(),
          },
          'cac:Item': {
            'cbc:Description': line.description,
            'cbc:Name': line.name,
            'cac:SellersItemIdentification': {
              'cbc:ID': line.sellerIdentifier?.toPrimitive(),
            },
            'cac:StandardItemIdentification': {
              'cbc:ID': line.standardIdentifier?.toPrimitive(),
            },
            'cac:OriginCountry': {
              'cbc:IdentificationCode': line.originCountryCode,
            },
            'cac:CommodityClassification': line.classificationIdentifiers?.map(
              (identifier) => ({
                'cbc:ItemClassificationCode': identifier.toPrimitive(),
              }),
            ),
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

    return builder.build(omitEmpty(json));
  }
}
