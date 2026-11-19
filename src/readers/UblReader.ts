/**
 * UBL eInvoicing Reader
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { X2jOptions, XMLParser } from 'fast-xml-parser';
import AbstractReader from './AbstractReader';
import UnsupportedDocumentError from '../error/UnsupportedDocumentError';
import Document from '../entity/Document';
import { getRuleset } from '../index';
import { DocumentId, DocumentTypes, ParseIssue } from '../interface/IDocument';
import DateOnly from '../valueObject/DateOnly';
import DocumentType from '../valueObject/DocumentType';
import CurrencyCode from '../valueObject/CurrencyCode';
import InvoiceReference from '../valueObject/InvoiceReference';
import Attachment from '../valueObject/Attachment';
import BinaryObject from '../valueObject/BinaryObject';
import Party from '../valueObject/Party';
import Address from '../valueObject/Address';
import DocumentLine from '../entity/DocumentLine';
import { DocumentLineId } from '../interface/IDocumentLine';
import ListIdentifier from '../valueObject/ListIdentifier';
import Attribute from '../valueObject/Attribute';
import Payee from '../valueObject/Payee';
import Delivery from '../valueObject/Delivery';
import {
  strOrUnd,
  numOrUnd,
  getArray,
  childByLocalName,
  XmlNode,
  nodeToId,
  nodeToQuantity,
} from '../helpers';
import Payment from '../valueObject/Payment';
import PaymentCard from '../valueObject/PaymentCard';
import PaymentTransfer from '../valueObject/PaymentTransfer';
import PaymentMandate from '../valueObject/PaymentMandate';
import AllowanceCharge from '../valueObject/AllowanceCharge';
import Tax from '../entity/Tax';
import { TaxId } from '../interface/ITax';
import Contact from '../valueObject/Contact';
import TaxRegistration from '../valueObject/TaxRegistration';

/**
 * @link https://docs.peppol.eu/poacc/billing/3.0/2024-Q2/syntax/ubl-invoice/tree/
 */
export default class UblReader extends AbstractReader {
  // Non-fatal problems collected during the current read() call. An invalid
  // value is omitted from the result (never guessed) and recorded here, so a
  // partially readable document still parses; see Document.issues.
  private issues: ParseIssue[] = [];

  // Parse an xsd:date, tolerating invalid values: the field is dropped and
  // the problem recorded as an issue instead of failing the whole document
  // (day-first dates like 30-07-2026 occur in real-world OIOUBL).
  private dateOrIssue(
    value: string | number | undefined,
    field: string,
  ): DateOnly | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    try {
      return DateOnly.create(String(value));
    } catch {
      this.issues.push({
        code: 'invalid-date',
        field,
        raw: String(value),
        message: `Invalid date "${value}" in ${field}; field omitted`,
      });
      return undefined;
    }
  }

  async read(content: string): Promise<Document> {
    this.issues = [];
    const attributeValueProcessor = (name: string, value: string) => {
      switch (name) {
        case 'schemeID': {
          return null;
        }
        default:
          return value;
      }
    };

    // Identifiers stay text as written (a leading zero is part of the value),
    // under whatever prefix the element is bound to.
    const tagValueProcessor = (tagName: string, tagValue: string) => {
      switch (tagName.split(':').pop()) {
        case 'ItemClassificationCode':
        case 'CompanyID':
        case 'EndpointID':
        case 'ID':
        case 'SalesOrderID': {
          return null;
        }
        default:
          return tagValue;
      }
    };

    const options: X2jOptions = {
      attributeNamePrefix: 'attr_',
      ignoreAttributes: false,
      parseAttributeValue: true,
      trimValues: true,
      attributeValueProcessor,
      tagValueProcessor,
    };
    const parser = new XMLParser(options);
    const json = parser.parse(content);
    // The root element may carry a namespace prefix (e.g. <urn:Invoice> in
    // OIOUBL documents); match on the local name.
    const rootKeys = Object.keys(json);
    const invoiceRootKey = rootKeys.find(
      (key) => key === 'Invoice' || key.endsWith(':Invoice'),
    );
    const creditNoteRootKey = rootKeys.find(
      (key) => key === 'CreditNote' || key.endsWith(':CreditNote'),
    );
    if (!invoiceRootKey && !creditNoteRootKey) {
      throw new UnsupportedDocumentError(
        'Unsupported document type: root element is not a UBL Invoice or CreditNote',
      );
    }
    const documentType = invoiceRootKey
      ? DocumentTypes.Invoice
      : DocumentTypes.CreditNote;
    const rootKey = invoiceRootKey ?? creditNoteRootKey;
    const documentNode = json[rootKey];

    const xmlNamespaces = Object.keys(documentNode)
      .filter((key) => key.startsWith('attr_xmlns'))
      .reduce((acc, key) => {
        acc[key.replace('attr_', '')] = documentNode[key];
        return acc;
      }, {});

    // The root's local name is shared by other dialects — Danish OIOXML
    // (UBL 0.7) also roots at <Invoice> — so the name alone does not say this
    // is a document the mappings below understand. The namespace the root
    // itself is declared in does.
    const rootPrefix = rootKey.includes(':') ? rootKey.split(':')[0] : null;
    const rootNamespace =
      xmlNamespaces[rootPrefix ? `xmlns:${rootPrefix}` : 'xmlns'];
    const expectedNamespace = invoiceRootKey
      ? 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2'
      : 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2';
    if (rootNamespace !== expectedNamespace) {
      throw new UnsupportedDocumentError(
        `Unsupported document type: root element is not in the ${expectedNamespace} namespace`,
      );
    }

    // BT-24: Specification identifier
    const customizationId = documentNode['cbc:CustomizationID'];
    const ruleset = getRuleset(customizationId);

    const taxNodes = getArray(documentNode, [
      'cac:TaxTotal',
      'cac:TaxSubtotal',
    ]);
    const taxes = taxNodes.map((taxNode: XmlNode) =>
      Tax.create({
        id: new TaxId(
          strOrUnd(taxNode['cac:TaxCategory']?.['cbc:ID']),
          numOrUnd(taxNode['cac:TaxCategory']?.['cbc:Percent']),
        ),
        currency: CurrencyCode.create(
          strOrUnd(taxNode['cbc:TaxAmount']?.attr_currencyID),
        ),
        taxAmount: numOrUnd(taxNode['cbc:TaxAmount']),
        taxableAmount: numOrUnd(taxNode['cbc:TaxableAmount']),
        taxExemptionReason: strOrUnd(
          taxNode['cac:TaxCategory']?.['cbc:TaxExemptionReason'],
        ),
        taxExemptionReasonCode: strOrUnd(
          taxNode['cac:TaxCategory']?.['cbc:TaxExemptionReasonCode'],
        ),
        percent: numOrUnd(taxNode['cac:TaxCategory']?.['cbc:Percent']),
      }),
    );

    // BT-9: Due date
    const dueDate =
      documentNode['cbc:DueDate'] ??
      documentNode['cac:PaymentMeans']?.['cbc:PaymentDueDate'];

    // BT-3: Invoice type code
    const type =
      documentNode['cbc:InvoiceTypeCode'] ??
      documentNode['cbc:CreditNoteTypeCode'];

    // BT-7: Tax point date
    const taxPointDate = documentNode['cbc:TaxPointDate'];

    // BT-13 and BT-14 are matched by local name: senders bind the component
    // namespaces to prefixes other than cac: and cbc:, or declare them as the
    // default namespace on the element itself.
    const orderReference = childByLocalName(documentNode, 'OrderReference');

    // BG-3: Preceding invoice references
    const invoiceReferences = getArray(documentNode, ['cac:BillingReference']);
    const precedingInvoiceReference = invoiceReferences.map(
      (reference: XmlNode) => {
        const node = reference['cac:InvoiceDocumentReference'];
        return InvoiceReference.create({
          id: node['cbc:ID'],
          issueDate: this.dateOrIssue(
            node['cbc:IssueDate'],
            'cac:BillingReference/cbc:IssueDate',
          ),
        });
      },
    );

    // BG-24: Attachment nodes
    const attachmentNodes = getArray(documentNode, [
      'cac:AdditionalDocumentReference',
    ]);
    const attachments = attachmentNodes.map((attachment: XmlNode) => {
      let content: BinaryObject | undefined = undefined;
      const embeddedDocument =
        attachment['cac:Attachment']?.['cbc:EmbeddedDocumentBinaryObject'];
      if (embeddedDocument) {
        // BT-125: Attached document
        content = BinaryObject.createFromBase64({
          base64: strOrUnd(embeddedDocument),
          mimeCode: embeddedDocument['attr_mimeCode'],
          filename: embeddedDocument['attr_filename'],
        });
      }
      return Attachment.create({
        content,
        id: nodeToId(attachment['cbc:ID']), // BT-122: Supporting document reference
        documentTypeCode: attachment['cbc:DocumentTypeCode'], // BT-18: Supporting document type code
        description: attachment['cbc:DocumentDescription'], // BT-123: Supporting document description
        externalUri:
          attachment['cac:Attachment']?.['cac:ExternalReference']?.['cbc:URI'], // BT-124: External document location
      });
    });
    const lines =
      documentType === DocumentTypes.Invoice
        ? getArray(documentNode, ['cac:InvoiceLine'])
        : getArray(documentNode, ['cac:CreditNoteLine']);

    const charges = getArray(documentNode, ['cac:AllowanceCharge']).map(
      (node: XmlNode) => this.allowanceOrChargeFromXmlNode(node, taxes),
    );

    const document = Document.create(documentType, ruleset, {
      // BT-1: Invoice number
      id: documentNode['cbc:ID']
        ? new DocumentId(documentNode['cbc:ID'].toString())
        : new DocumentId(),

      // BT-2: Issue date
      issueDate: this.dateOrIssue(
        documentNode['cbc:IssueDate'],
        'cbc:IssueDate',
      ),

      // BT-3: Invoice type code
      type: type ? DocumentType.create(type) : undefined,

      // BT-5: Invoice currency code
      currency: documentNode['cbc:DocumentCurrencyCode']
        ? CurrencyCode.create(
            strOrUnd(documentNode['cbc:DocumentCurrencyCode']),
          )
        : undefined,

      // BT-6: VAT accounting currency code
      taxCurrency: documentNode['cbc:TaxCurrencyCode']
        ? CurrencyCode.create(strOrUnd(documentNode['cbc:TaxCurrencyCode']))
        : undefined,

      // BT-7: Tax point date
      taxPointDate: this.dateOrIssue(taxPointDate, 'cbc:TaxPointDate'),

      // BT-9: Due date
      dueDate: this.dateOrIssue(
        dueDate,
        documentNode['cbc:DueDate']
          ? 'cbc:DueDate'
          : 'cac:PaymentMeans/cbc:PaymentDueDate',
      ),

      // BT-10: Buyer reference
      buyerReference: strOrUnd(documentNode['cbc:BuyerReference']),

      // BT-12: Contract reference
      contractReference: nodeToId(
        documentNode['cac:ContractDocumentReference']?.['cbc:ID'],
      ),

      // BT-13: Purchase order reference
      purchaseOrderReference: nodeToId(childByLocalName(orderReference, 'ID')),

      // BT-17: Originator document reference
      originatorDocumentReference: nodeToId(
        documentNode['cac:OriginatorDocumentReference']?.['cbc:ID'],
      ),

      // BT-14: Sales order reference
      salesOrderReference: strOrUnd(
        childByLocalName(orderReference, 'SalesOrderID'),
      ),

      // BT-17: Tender or lot reference
      tenderOrLotReference: strOrUnd(
        documentNode['cbc:OriginatorDocumentReference']?.['cbc:ID'],
      ),

      // BT-19: Buyer accounting reference
      buyerAccountingReference: strOrUnd(documentNode['cbc:AccountingCost']),

      // BT-22: Notes
      notes: strOrUnd(documentNode['cbc:Note']),

      // BT-23: Business process type
      businessProcess: strOrUnd(documentNode['cbc:ProfileID']),

      // BT-24
      customizationId: strOrUnd(customizationId),

      // BG-3: Preceding invoice references
      precedingInvoiceReference: precedingInvoiceReference.length
        ? precedingInvoiceReference
        : undefined,

      // BG-14: Invoice period
      ...this.periodFromXmlNode(documentNode),

      // Seller
      seller: this.partyFromXmlNode(
        documentNode['cac:AccountingSupplierParty']?.['cac:Party'],
      ),

      // Buyer
      buyer: this.partyFromXmlNode(
        documentNode['cac:AccountingCustomerParty']?.['cac:Party'],
      ),

      // Payee
      payee: this.payeeFromXmlNode(documentNode['cac:PayeeParty']),

      // Delivery
      delivery: this.deliveryFromXmlNode(documentNode['cac:Delivery']),

      // BG-24: Attachment nodes
      attachments: attachments.length ? attachments : undefined,

      // BT-113: Paid amount
      paidAmount: numOrUnd(
        documentNode['cac:LegalMonetaryTotal']?.['cbc:PrepaidAmount'],
      ),

      // BT-114: Rounding amount
      roundingAmount: numOrUnd(
        documentNode['cac:LegalMonetaryTotal']?.['cbc:PayableRoundingAmount'],
      ),

      lines: lines.map((line) =>
        this.documentLineFromXmlNode(line, documentType, taxes),
      ),

      payment: this.paymentFromXmlNode(documentNode),

      charges: charges.length ? charges : undefined,

      taxes: taxes.length ? taxes : undefined,

      xmlNamespaces,

      issues: this.issues.length ? this.issues : undefined,
    });
    return document;
  }

  partyFromXmlNode(node: XmlNode): Party | undefined {
    if (!node) {
      return undefined;
    }
    // Additional identifiers
    const additionalIdentifiersNodes = getArray(node, [
      'cac:PartyIdentification',
    ]);
    const additionalIdentifiers = additionalIdentifiersNodes.map(
      (node: XmlNode) => nodeToId(node['cbc:ID']),
    );

    const taxRegistration: TaxRegistration[] | undefined = [];

    // VAT number and tax registration identifier
    for (const vatNode of getArray(node, ['cac:PartyTaxScheme'])) {
      taxRegistration.push(
        TaxRegistration.create({
          id: nodeToId(vatNode['cbc:CompanyID']),
          scheme: strOrUnd(vatNode['cac:TaxScheme']?.['cbc:ID']),
        }),
      );
    }

    return Party.create({
      endpointId: nodeToId(node['cbc:EndpointID']),
      address: this.addressFromXmlNode(node['cac:PostalAddress']),
      tradingName: strOrUnd(node['cac:PartyName']?.['cbc:Name']),
      legalName: strOrUnd(
        node['cac:PartyLegalEntity']?.['cbc:RegistrationName'],
      ),
      companyId: nodeToId(node['cac:PartyLegalEntity']?.['cbc:CompanyID']),
      companyLegalForm: strOrUnd(
        node['cac:PartyLegalEntity']?.['cbc:CompanyLegalForm'],
      ), // BT-33: Seller additional legal information
      contact: this.contactFromXmlNode(node['cac:Contact']),
      additionalIdentifiers: additionalIdentifiers.length
        ? additionalIdentifiers
        : undefined,
      taxRegistration: taxRegistration.length ? taxRegistration : undefined,
    });
  }

  payeeFromXmlNode(node: XmlNode): Payee | undefined {
    if (!node) {
      return undefined;
    }
    // Additional identifiers
    const additionalIdentifiersNodes = getArray(node, [
      'cac:PartyIdentification',
    ]);
    const additionalIdentifiers = additionalIdentifiersNodes.map(
      (node: XmlNode) => strOrUnd(node['cbc:ID']),
    );

    return Payee.create({
      name: strOrUnd(node['cac:PartyName']?.['cbc:Name']),
      companyId: strOrUnd(node['cac:PartyLegalEntity']?.['cbc:CompanyID']),
      additionalIdentifiers,
    });
  }

  deliveryFromXmlNode(node: XmlNode): Delivery | undefined {
    if (!node) {
      return undefined;
    }

    return Delivery.create({
      name: strOrUnd(
        node['cac:DeliveryParty']?.['cac:PartyName']?.['cbc:Name'],
      ),
      date: this.dateOrIssue(
        node['cbc:ActualDeliveryDate'],
        'cac:Delivery/cbc:ActualDeliveryDate',
      ),
      locationId: nodeToId(node['cac:DeliveryLocation']?.['cbc:ID']),
      address: this.addressFromXmlNode(
        node['cac:DeliveryAddress'] ??
          node['cac:DeliveryLocation']?.['cac:Address'],
      ),
    });
  }

  paymentFromXmlNode(node: XmlNode): Payment | undefined {
    if (!node) {
      return undefined;
    }
    const meansNode = node['cac:PaymentMeans'];
    const note = node['cac:PaymentTerms']?.['cbc:Note'];
    if (!meansNode && !note) {
      return undefined;
    }

    return Payment.create({
      // BT-20: Payment terms
      terms: strOrUnd(note),

      // BT-81: Payment means code
      meansCode: strOrUnd(meansNode['cbc:PaymentMeansCode']),

      // BT-82: Payment means name
      meansName: strOrUnd(meansNode['cbc:PaymentMeansCode']?.['attr_name']),

      // BT-83: Payment ID
      id: strOrUnd(meansNode['cbc:PaymentID']),

      // BG-18: Payment card
      card: meansNode['cac:CardAccount']
        ? PaymentCard.create({
            pan: strOrUnd(
              meansNode['cac:CardAccount']?.['cbc:PrimaryAccountNumberID'],
            ),
            network: strOrUnd(meansNode['cac:CardAccount']?.['cbc:NetworkID']),
            holder: strOrUnd(meansNode['cac:CardAccount']?.['cbc:HolderName']),
          })
        : undefined,

      // BG-17: Payment transfers
      transfer: meansNode['cac:PayeeFinancialAccount']
        ? PaymentTransfer.create({
            account: strOrUnd(
              meansNode['cac:PayeeFinancialAccount']?.['cbc:ID'],
            ),
            name: strOrUnd(
              meansNode['cac:PayeeFinancialAccount']?.['cbc:Name'],
            ),
            provider: nodeToId(
              meansNode['cac:PayeeFinancialAccount']?.[
                'cac:FinancialInstitutionBranch'
              ]?.['cbc:ID'],
            ),
          })
        : undefined,

      // BG-19: Payment mandate
      mandate: meansNode['cac:PaymentMandate']
        ? PaymentMandate.create({
            reference: strOrUnd(meansNode['cac:PaymentMandate']?.['cbc:ID']),
            account: strOrUnd(
              meansNode['cac:PaymentMandate']?.['cac:PayerFinancialAccount']?.[
                'cbc:ID'
              ],
            ),
          })
        : undefined,
    });
  }

  addressFromXmlNode(node: XmlNode): Address | undefined {
    if (!node) {
      return undefined;
    }
    const addressLines: string[] = [
      strOrUnd(node['cbc:StreetName']),
      strOrUnd(node['cbc:AdditionalStreetName']),
      strOrUnd(node['cbc:BuildingNumber']),
    ].filter(Boolean);

    return Address.create({
      countryCode: strOrUnd(node['cac:Country']?.['cbc:IdentificationCode']),
      cityName: strOrUnd(node['cbc:CityName']),
      postalZone: strOrUnd(node['cbc:PostalZone']),
      streetName: strOrUnd(node['cbc:StreetName']),
      subdivision: strOrUnd(node['cbc:CountrySubentity']),
      addressLines: addressLines.length ? addressLines : undefined,
    });
  }

  contactFromXmlNode(node: XmlNode): Party['contact'] | undefined {
    if (!node) {
      return undefined;
    }

    return Contact.create({
      name: strOrUnd(node['cbc:Name']),
      phone: strOrUnd(node['cbc:Telephone']),
      email: strOrUnd(node['cbc:ElectronicMail']),
    });
  }

  allowanceOrChargeFromXmlNode(
    node: XmlNode,
    taxes: Tax[],
  ): AllowanceCharge | undefined {
    if (!node) {
      return undefined;
    }

    const taxId = new TaxId(
      strOrUnd(node['cac:TaxCategory']?.['cbc:ID']),
      numOrUnd(node['cac:TaxCategory']?.['cbc:Percent']),
    );
    const tax = taxes.find((tax) => tax.id.equals(taxId));
    if (node['cac:TaxCategory']?.['cbc:ID'] && !tax) {
      throw new Error(`Tax category ${taxId} not found`);
    }

    return AllowanceCharge.create({
      isCharge: node['cbc:ChargeIndicator'],
      reasonCode: strOrUnd(node['cbc:AllowanceChargeReasonCode']),
      reasonText: strOrUnd(node['cbc:AllowanceChargeReason']),
      factorAmount: numOrUnd(node['cbc:MultiplierFactorNumeric']),
      baseAmount: numOrUnd(node['cbc:BaseAmount']),
      amount: numOrUnd(node['cbc:Amount']),
      tax,
    });
  }

  periodFromXmlNode(node: XmlNode) {
    const periodStart = node['cac:InvoicePeriod']?.['cbc:StartDate'];
    const periodEnd = node['cac:InvoicePeriod']?.['cbc:EndDate'];

    return {
      periodStart: this.dateOrIssue(
        periodStart,
        'cac:InvoicePeriod/cbc:StartDate',
      ),
      periodEnd: this.dateOrIssue(periodEnd, 'cac:InvoicePeriod/cbc:EndDate'),
    };
  }

  documentLineFromXmlNode(
    node: XmlNode,
    documentType: DocumentTypes,
    taxes: Tax[],
  ): DocumentLine | undefined {
    if (!node) {
      return undefined;
    }

    // BT-158: Item classification identifiers
    const classNodes = getArray(node, [
      'cac:Item',
      'cac:CommodityClassification',
      'cbc:ItemClassificationCode',
    ]);
    const classificationIdentifiers = classNodes.map((item: XmlNode) => {
      return ListIdentifier.create({
        id: strOrUnd(item),
        scheme: item['attr_listID'],
      });
    });

    // BG-32: Item attributes
    const attributeNodes = getArray(node, [
      'cac:Item',
      'cac:AdditionalItemProperty',
    ]);
    const attributes = attributeNodes.map((item: XmlNode) =>
      Attribute.create({
        name: strOrUnd(item['cbc:Name']),
        value: strOrUnd(item['cbc:Value']),
      }),
    );

    const taxId = new TaxId(
      strOrUnd(node['cac:Item']?.['cac:ClassifiedTaxCategory']?.['cbc:ID']),
      numOrUnd(
        node['cac:Item']?.['cac:ClassifiedTaxCategory']?.['cbc:Percent'],
      ),
    );
    const tax = taxes.find((tax) => tax.id.equals(taxId));
    if (node['cac:Item']?.['cbc:ClassifiedTaxCategory']?.['cbc:ID'] && !tax) {
      throw new Error(`Tax category ${taxId} not found`);
    }
    const charges = getArray(node, ['cac:AllowanceCharge']).map(
      (node: XmlNode) => this.allowanceOrChargeFromXmlNode(node, taxes),
    );

    return DocumentLine.create({
      // BT-126: Invoice line identifier
      id: new DocumentLineId(strOrUnd(node['cbc:ID'])),

      // BT-127: Invoice line note
      note: strOrUnd(node['cbc:Note']),

      quantity:
        documentType === DocumentTypes.Invoice
          ? numOrUnd(node['cbc:InvoicedQuantity'])
          : numOrUnd(node['cbc:CreditedQuantity']),
      unitCode: strOrUnd(node['cbc:InvoicedQuantity']?.attr_unitCode),

      // BT-133: Buyer accounting reference
      buyerAccountingReference: strOrUnd(node['cbc:AccountingCost']),
      // BG-26: Invoice line period
      ...this.periodFromXmlNode(node),

      // BT-132: Order line reference
      orderLineReference: nodeToId(
        node['cac:OrderLineReference']?.['cbc:LineID'],
      ),

      // BT-153: Item name
      name: strOrUnd(node['cac:Item']?.['cbc:Name']),

      // BT-154: Item description
      description: strOrUnd(node['cac:Item']?.['cbc:Description']),

      // BT-156: Buyer identifier
      buyerIdentifier: strOrUnd(
        node['cac:Item']?.['cac:BuyersItemIdentification']?.['cbc:ID'],
      ),

      // BT-155: Seller identifier
      sellerIdentifier: nodeToId(
        node['cac:Item']?.['cac:SellersItemIdentification']?.['cbc:ID'],
      ),

      // BT-157: Standard identifier
      standardIdentifier: nodeToId(
        node['cac:Item']?.['cac:StandardItemIdentification']?.['cbc:ID'],
      ),

      // BT-159: Item origin country
      originCountryCode: strOrUnd(
        node['cac:Item']?.['cac:OriginCountry']?.['cbc:IdentificationCode'],
      ),

      // BT-158: Item classification identifiers
      classificationIdentifiers: classificationIdentifiers.length
        ? classificationIdentifiers
        : undefined,

      price: numOrUnd(node['cac:Price']?.['cbc:PriceAmount']),

      // BT-131: Invoice line net amount
      netAmount: numOrUnd(node['cbc:LineExtensionAmount']),

      baseQuantity: nodeToQuantity(node['cac:Price']?.['cbc:BaseQuantity']),

      // BG-32: Item attributes
      attributes: attributes.length ? attributes : undefined,

      // Allowances and charges
      charges: charges.length ? charges : undefined,

      tax,
    });
  }
}
