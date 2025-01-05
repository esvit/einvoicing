/**
 * Document.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { Entity } from '../base/Entity';
import {
  IDocument,
  DocumentId,
  DocumentTypes,
  DEFAULT_CUSTOMIZATION_ID,
  DEFAULT_PROFILE_ID,
} from '../interface/IDocument';
import DateOnly from '../valueObject/DateOnly';
import DocumentType from '../valueObject/DocumentType';
import CurrencyCode from '../valueObject/CurrencyCode';
import InvoiceReference from '../valueObject/InvoiceReference';
import Attachment from '../valueObject/Attachment';
import Party from '../valueObject/Party';
import Payee from '../valueObject/Payee';
import Delivery from '../valueObject/Delivery';
import DocumentLine from './DocumentLine';
import Payment from '../valueObject/Payment';
import AllowanceCharge from '../valueObject/AllowanceCharge';
import Tax from './Tax';
import AbstractRuleset from '../ruleset/AbstractRuleset';
import Identifier from '../valueObject/Identifier';

export default class Document extends Entity<IDocument, string, DocumentId> {
  protected _ruleset: AbstractRuleset;
  protected _documentType: DocumentTypes;

  constructor(props: IDocument, id?: DocumentId) {
    super(
      {
        customizationId: DEFAULT_CUSTOMIZATION_ID,
        businessProcess: DEFAULT_PROFILE_ID,
        ...props,
      },
      id,
    );
  }

  public static create(
    type: DocumentTypes,
    ruleset: AbstractRuleset,
    props: IDocument,
  ): Document {
    const item = new Document(props, props.id);
    item._documentType = type;
    item._ruleset = ruleset;
    return item;
  }

  validate() {
    return this._ruleset
      ? this._ruleset.validate(this)
      : { errors: [], warning: [] };
  }

  /**
   * Get the document type.
   */
  get documentType() {
    return this._documentType;
  }

  /**
   * Get the ruleset.
   */
  get ruleset() {
    return this._ruleset;
  }

  /**
   * Get the document ID.
   */
  get id() {
    return this.props.id;
  }

  /**
   * Set the document ID.
   */
  set id(value: DocumentId) {
    this.props.id = value;
  }

  /**
   * Get the customization ID.
   */
  get customizationId() {
    return this.props.customizationId;
  }

  /**
   * Set the customization ID.
   */
  set customizationId(value: string) {
    this.props.customizationId = value;
  }

  /**
   * Get the business process.
   */
  get businessProcess() {
    return this.props.businessProcess;
  }

  /**
   * Set the business process.
   */
  set businessProcess(value: string | undefined) {
    this.props.businessProcess = value;
  }

  /**
   * Get the issue date.
   */
  get issueDate() {
    return this.props.issueDate;
  }

  /**
   * Set the issue date.
   */
  set issueDate(value: DateOnly | undefined) {
    this.props.issueDate = value;
  }

  /**
   * Get the due date.
   */
  get dueDate() {
    return this.props.dueDate;
  }

  /**
   * Set the due date.
   */
  set dueDate(value: DateOnly | undefined) {
    this.props.dueDate = value;
  }

  /**
   * Get the document type.
   */
  get type() {
    return this.props.type;
  }

  /**
   * Set the document type.
   */
  set type(value: DocumentType | undefined) {
    this.props.type = value;
  }

  /**
   * Get the notes.
   */
  get notes() {
    return this.props.notes;
  }

  /**
   * Set the notes.
   */
  set notes(value: string | undefined) {
    this.props.notes = value;
  }

  /**
   * Get the currency.
   */
  get currency() {
    return this.props.currency;
  }

  /**
   * Set the currency.
   */
  set currency(value: CurrencyCode | undefined) {
    this.props.currency = value;
  }

  /**
   * Get the buyer reference.
   */
  get buyerReference() {
    return this.props.buyerReference;
  }

  /**
   * Set the buyer reference.
   */
  set buyerReference(value: string | undefined) {
    this.props.buyerReference = value;
  }

  /**
   * Get the buyer accounting reference.
   */
  get buyerAccountingReference() {
    return this.props.buyerAccountingReference;
  }

  /**
   * Set the buyer accounting reference.
   */
  set buyerAccountingReference(value: string | undefined) {
    this.props.buyerAccountingReference = value;
  }

  /**
   * Get the purchase order reference.
   */
  get purchaseOrderReference() {
    return this.props.purchaseOrderReference;
  }

  /**
   * Set the purchase order reference.
   */
  set purchaseOrderReference(value: Identifier | undefined) {
    this.props.purchaseOrderReference = value;
  }

  /**
   * Get the originator document reference.
   */
  get originatorDocumentReference() {
    return this.props.originatorDocumentReference;
  }

  /**
   * Set the originator document reference.
   */
  set originatorDocumentReference(value: Identifier | undefined) {
    this.props.originatorDocumentReference = value;
  }

  /**
   * Get the sales order reference.
   */
  get salesOrderReference() {
    return this.props.salesOrderReference;
  }

  /**
   * Set the sales order reference.
   */
  set salesOrderReference(value: string | undefined) {
    this.props.salesOrderReference = value;
  }

  /**
   * Get the tender or lot reference.
   */
  get tenderOrLotReference() {
    return this.props.tenderOrLotReference;
  }

  /**
   * Set the tender or lot reference.
   */
  set tenderOrLotReference(value: string | undefined) {
    this.props.tenderOrLotReference = value;
  }

  /**
   * Get the contract reference.
   */
  get contractReference() {
    return this.props.contractReference;
  }

  /**
   * Set the contract reference.
   */
  set contractReference(value: Identifier | undefined) {
    this.props.contractReference = value;
  }

  /**
   * Get the preceding invoice reference.
   */
  get precedingInvoiceReference() {
    return this.props.precedingInvoiceReference;
  }

  /**
   * Set the preceding invoice reference.
   */
  set precedingInvoiceReference(value: InvoiceReference[] | undefined) {
    this.props.precedingInvoiceReference = value;
  }

  /**
   * Get the attachments.
   */
  get attachments() {
    return this.props.attachments;
  }

  /**
   * Set the attachments.
   */
  set attachments(value: Attachment[] | undefined) {
    this.props.attachments = value;
  }

  /**
   * Get the seller.
   */
  get seller() {
    return this.props.seller;
  }

  /**
   * Set the seller.
   */
  set seller(value: Party | undefined) {
    this.props.seller = value;
  }

  /**
   * Get the buyer.
   */
  get buyer() {
    return this.props.buyer;
  }

  /**
   * Set the buyer.
   */
  set buyer(value: Party | undefined) {
    this.props.buyer = value;
  }

  /**
   * Get the payee.
   */
  get payee() {
    return this.props.payee;
  }

  /**
   * Set the payee.
   */
  set payee(value: Payee | undefined) {
    this.props.payee = value;
  }

  /**
   * Get the delivery.
   */
  get delivery() {
    return this.props.delivery;
  }

  /**
   * Set the delivery.
   */
  set delivery(value: Delivery | undefined) {
    this.props.delivery = value;
  }

  /**
   * Get the period start date.
   */
  get periodStart() {
    return this.props.periodStart;
  }

  /**
   * Set the period start date.
   */
  set periodStart(value: DateOnly | undefined) {
    this.props.periodStart = value;
  }

  /**
   * Get the period end date.
   */
  get periodEnd() {
    return this.props.periodEnd;
  }

  /**
   * Set the period end date.
   */
  set periodEnd(value: DateOnly | undefined) {
    this.props.periodEnd = value;
  }

  /**
   * Get the paid amount.
   */
  get paidAmount() {
    return this.props.paidAmount;
  }

  /**
   * Set the paid amount.
   */
  set paidAmount(value: number | undefined) {
    this.props.paidAmount = value;
  }

  /**
   * Get the rounding amount.
   */
  get roundingAmount() {
    return this.props.roundingAmount;
  }

  /**
   * Set the rounding amount.
   */
  set roundingAmount(value: number | undefined) {
    this.props.roundingAmount = value;
  }

  /**
   * Get the document lines.
   */
  get lines() {
    return this.props.lines;
  }

  /**
   * Set the document lines.
   */
  set lines(value: DocumentLine[] | undefined) {
    this.props.lines = value;
  }

  /**
   * Get the payment.
   */
  get payment() {
    return this.props.payment;
  }

  /**
   * Set the payment.
   */
  set payment(value: Payment | undefined) {
    this.props.payment = value;
  }

  /**
   * Get the charges.
   */
  get charges() {
    return this.props.charges;
  }

  /**
   * Set the charges.
   */
  set charges(value: AllowanceCharge[] | undefined) {
    this.props.charges = value;
  }

  /**
   * Get the tax point date.
   */
  get taxPointDate() {
    return this.props.taxPointDate;
  }

  /**
   * Set the tax point date.
   */
  set taxPointDate(value: DateOnly | undefined) {
    this.props.taxPointDate = value;
  }

  /**
   * Get the taxes.
   */
  get taxes() {
    return this.props.taxes;
  }

  /**
   * Set the taxes.
   */
  set taxes(value: Tax[] | undefined) {
    this.props.taxes = value;
  }

  /**
   * Get the tax amount.
   */
  get taxAmount() {
    return this.props.taxAmount;
  }

  /**
   * Set the tax amount.
   */
  set taxAmount(value: number | undefined) {
    this.props.taxAmount = value;
  }

  /**
   * Get the tax currency.
   */
  get taxCurrency() {
    return this.props.taxCurrency;
  }

  /**
   * Set the tax currency.
   */
  set taxCurrency(value: CurrencyCode | undefined) {
    this.props.taxCurrency = value;
  }

  /**
   * Get the xml namespaces.
   */
  get xmlNamespaces() {
    return this.props.xmlNamespaces;
  }

  /**
   * Set the xml namespaces.
   */
  set xmlNamespaces(value: { [key: string]: string } | undefined) {
    this.props.xmlNamespaces = value;
  }

  toPrimitive() {
    return this.props;
  }
}
