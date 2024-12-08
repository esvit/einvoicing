/**
 * IDocument.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {EntityId} from "../base/EntityId";
import DateOnly from "../valueObject/DateOnly";
import DocumentType from "../valueObject/DocumentType";
import CurrencyCode from "../valueObject/CurrencyCode";
import InvoiceReference from "../valueObject/InvoiceReference";
import Attachment from "../valueObject/Attachment";
import Party from "../valueObject/Party";
import DocumentLine from "../entity/DocumentLine";
import Delivery from "../valueObject/Delivery";
import Payee from "../valueObject/Payee";
import Payment from "../valueObject/Payment";
import AllowanceCharge from "../valueObject/AllowanceCharge";
import Tax from "../entity/Tax";

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
  purchaseOrderReference?: string;
  salesOrderReference?: string;
  tenderOrLotReference?: string;
  contractReference?: string;
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

  /**
   * Get the document ID.
   */
  get id(): DocumentId {
    return this.id;
  }

  /**
   * Set the document ID.
   */
  set id(value: DocumentId) {
    this.id = value;
  }

  /**
   * Get the issue date.
   */
  get issueDate(): DateOnly | undefined {
    return this.issueDate;
  }

  /**
   * Set the issue date.
   */
  set issueDate(value: DateOnly | undefined) {
    this.issueDate = value;
  }

  /**
   * Get the due date.
   */
  get dueDate(): DateOnly | undefined {
    return this.dueDate;
  }

  /**
   * Set the due date.
   */
  set dueDate(value: DateOnly | undefined) {
    this.dueDate = value;
  }

  /**
   * Get the document type.
   */
  get type(): DocumentType | undefined {
    return this.type;
  }

  /**
   * Set the document type.
   */
  set type(value: DocumentType | undefined) {
    this.type = value;
  }

  /**
   * Get the notes.
   */
  get notes(): string | undefined {
    return this.notes;
  }

  /**
   * Set the notes.
   */
  set notes(value: string | undefined) {
    this.notes = value;
  }

  /**
   * Get the currency.
   */
  get currency(): CurrencyCode | undefined {
    return this.currency;
  }

  /**
   * Set the currency.
   */
  set currency(value: CurrencyCode | undefined) {
    this.currency = value;
  }

  /**
   * Get the buyer reference.
   */
  get buyerReference(): string | undefined {
    return this.buyerReference;
  }

  /**
   * Set the buyer reference.
   */
  set buyerReference(value: string | undefined) {
    this.buyerReference = value;
  }

  /**
   * Get the buyer accounting reference.
   */
  get buyerAccountingReference(): string | undefined {
    return this.buyerAccountingReference;
  }

  /**
   * Set the buyer accounting reference.
   */
  set buyerAccountingReference(value: string | undefined) {
    this.buyerAccountingReference = value;
  }

  /**
   * Get the purchase order reference.
   */
  get purchaseOrderReference(): string | undefined {
    return this.purchaseOrderReference;
  }

  /**
   * Set the purchase order reference.
   */
  set purchaseOrderReference(value: string | undefined) {
    this.purchaseOrderReference = value;
  }

  /**
   * Get the sales order reference.
   */
  get salesOrderReference(): string | undefined {
    return this.salesOrderReference;
  }

  /**
   * Set the sales order reference.
   */
  set salesOrderReference(value: string | undefined) {
    this.salesOrderReference = value;
  }

  /**
   * Get the tender or lot reference.
   */
  get tenderOrLotReference(): string | undefined {
    return this.tenderOrLotReference;
  }

  /**
   * Set the tender or lot reference.
   */
  set tenderOrLotReference(value: string | undefined) {
    this.tenderOrLotReference = value;
  }

  /**
   * Get the contract reference.
   */
  get contractReference(): string | undefined {
    return this.contractReference;
  }

  /**
   * Set the contract reference.
   */
  set contractReference(value: string | undefined) {
    this.contractReference = value;
  }

  /**
   * Get the preceding invoice reference.
   */
  get precedingInvoiceReference(): InvoiceReference[] | undefined {
    return this.precedingInvoiceReference;
  }

  /**
   * Set the preceding invoice reference.
   */
  set precedingInvoiceReference(value: InvoiceReference[] | undefined) {
    this.precedingInvoiceReference = value;
  }

  /**
   * Get the attachments.
   */
  get attachments(): Attachment[] | undefined {
    return this.attachments;
  }

  /**
   * Set the attachments.
   */
  set attachments(value: Attachment[] | undefined) {
    this.attachments = value;
  }

  /**
   * Get the seller.
   */
  get seller(): Party | undefined {
    return this.seller;
  }

  /**
   * Set the seller.
   */
  set seller(value: Party | undefined) {
    this.seller = value;
  }

  /**
   * Get the buyer.
   */
  get buyer(): Party | undefined {
    return this.buyer;
  }

  /**
   * Set the buyer.
   */
  set buyer(value: Party | undefined) {
    this.buyer = value;
  }

  /**
   * Get the payee.
   */
  get payee(): Payee | undefined {
    return this.payee;
  }

  /**
   * Set the payee.
   */
  set payee(value: Payee | undefined) {
    this.payee = value;
  }

  /**
   * Get the delivery.
   */
  get delivery(): Delivery | undefined {
    return this.delivery;
  }

  /**
   * Set the delivery.
   */
  set delivery(value: Delivery | undefined) {
    this.delivery = value;
  }

  /**
   * Get the period start date.
   */
  get periodStart(): DateOnly | undefined {
    return this.periodStart;
  }

  /**
   * Set the period start date.
   */
  set periodStart(value: DateOnly | undefined) {
    this.periodStart = value;
  }

  /**
   * Get the period end date.
   */
  get periodEnd(): DateOnly | undefined {
    return this.periodEnd;
  }

  /**
   * Set the period end date.
   */
  set periodEnd(value: DateOnly | undefined) {
    this.periodEnd = value;
  }

  /**
   * Get the paid amount.
   */
  get paidAmount(): number | undefined {
    return this.paidAmount;
  }

  /**
   * Set the paid amount.
   */
  set paidAmount(value: number | undefined) {
    this.paidAmount = value;
  }

  /**
   * Get the rounding amount.
   */
  get roundingAmount(): number | undefined {
    return this.roundingAmount;
  }

  /**
   * Set the rounding amount.
   */
  set roundingAmount(value: number | undefined) {
    this.roundingAmount = value;
  }

  /**
   * Get the document lines.
   */
  get lines(): DocumentLine[] | undefined {
    return this.lines;
  }

  /**
   * Set the document lines.
   */
  set lines(value: DocumentLine[] | undefined) {
    this.lines = value;
  }

  /**
   * Get the payment.
   */
  get payment(): Payment | undefined {
    return this.payment;
  }

  /**
   * Set the payment.
   */
  set payment(value: Payment | undefined) {
    this.payment = value;
  }

  /**
   * Get the charges.
   */
  get charges(): AllowanceCharge[] | undefined {
    return this.charges;
  }

  /**
   * Set the charges.
   */
  set charges(value: AllowanceCharge[] | undefined) {
    this.charges = value;
  }

  /**
   * Get the tax point date.
   */
  get taxPointDate(): DateOnly | undefined {
    return this.taxPointDate;
  }

  /**
   * Set the tax point date.
   */
  set taxPointDate(value: DateOnly | undefined) {
    this.taxPointDate = value;
  }

  /**
   * Get the taxes.
   */
  get taxes(): Tax[] | undefined {
    return this.taxes;
  }

  /**
   * Set the taxes.
   */
  set taxes(value: Tax[] | undefined) {
    this.taxes = value;
  }

  /**
   * Get the tax amount.
   */
  get taxAmount(): number | undefined {
    return this.taxAmount;
  }

  /**
   * Set the tax amount.
   */
  set taxAmount(value: number | undefined) {
    this.taxAmount = value;
  }

  /**
   * Get the tax currency.
   */
  get taxCurrency(): CurrencyCode | undefined {
    return this.taxCurrency;
  }

  /**
   * Set the tax currency.
   */
  set taxCurrency(value: CurrencyCode | undefined) {
    this.taxCurrency = value;
  }
}
