/**
 * IDocument.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { EntityId } from '../base/EntityId';
import DateOnly from '../valueObject/DateOnly';
import DocumentType from '../valueObject/DocumentType';
import CurrencyCode from '../valueObject/CurrencyCode';
import InvoiceReference from '../valueObject/InvoiceReference';
import Attachment from '../valueObject/Attachment';
import Party from '../valueObject/Party';
import DocumentLine from '../entity/DocumentLine';
import Delivery from '../valueObject/Delivery';
import Payee from '../valueObject/Payee';
import Payment from '../valueObject/Payment';
import AllowanceCharge from '../valueObject/AllowanceCharge';
import Tax from '../entity/Tax';
import Identifier from '../valueObject/Identifier';

export class DocumentId extends EntityId<string> {
  readonly DocumentId = 'document_id';
}

export enum DocumentTypes {
  Invoice = 'invoice',
  CreditNote = 'credit_note',
}

export interface IDocument {
  id: DocumentId;
  issueDate?: DateOnly;
  dueDate?: DateOnly;
  type?: DocumentType;
  notes?: string;
  currency?: CurrencyCode;
  buyerReference?: string;
  buyerAccountingReference?: string;
  purchaseOrderReference?: Identifier;
  originatorDocumentReference?: Identifier;
  salesOrderReference?: string;
  tenderOrLotReference?: string;
  contractReference?: Identifier;
  precedingInvoiceReference?: InvoiceReference[];
  attachments?: Attachment[];

  seller?: Party;
  buyer?: Party;
  payee?: Payee;
  delivery?: Delivery;

  periodStart?: DateOnly;
  periodEnd?: DateOnly;

  paidAmount?: number;
  roundingAmount?: number;

  lines?: DocumentLine[];
  payment?: Payment;
  charges?: AllowanceCharge[];

  // tax
  taxPointDate?: DateOnly;
  taxes?: Tax[];
  taxAmount?: number;
  taxCurrency?: CurrencyCode;

  xmlNamespaces?: { [key: string]: string };
}
