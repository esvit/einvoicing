/**
 * DocumentLine.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {Entity} from "../base/Entity";
import {DocumentLineId, IDocumentLine} from "../interface/IDocumentLine";
import Tax from "./Tax";
import Identifier from "../valueObject/Identifier";
import Attribute from "../valueObject/Attribute";
import AllowanceCharge from "../valueObject/AllowanceCharge";
import DateOnly from "../valueObject/DateOnly";

export default
class DocumentLine extends Entity<IDocumentLine, string, DocumentLineId> {
  public static create(props: IDocumentLine): DocumentLine {
    return new DocumentLine(props, props.id);
  }

  /**
   * Get the document line ID.
   */
  get id() {
    return this.props.id;
  }

  /**
   * Set the document line ID.
   */
  set id(value: DocumentLineId) {
    this.props.id = value;
  }

  /**
   * Get the note.
   */
  get note() {
    return this.props.note;
  }

  /**
   * Set the note.
   */
  set note(value: string | undefined) {
    this.props.note = value;
  }

  /**
   * Get the unit code.
   */
  get unitCode() {
    return this.props.unitCode;
  }

  /**
   * Set the unit code.
   */
  set unitCode(value: string | undefined) {
    this.props.unitCode = value;
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
   * Get the order line reference.
   */
  get orderLineReference() {
    return this.props.orderLineReference;
  }

  /**
   * Set the order line reference.
   */
  set orderLineReference(value: string | undefined) {
    this.props.orderLineReference = value;
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
   * Get the name.
   */
  get name() {
    return this.props.name;
  }

  /**
   * Set the name.
   */
  set name(value: string | undefined) {
    this.props.name = value;
  }

  /**
   * Get the description.
   */
  get description() {
    return this.props.description;
  }

  /**
   * Set the description.
   */
  set description(value: string | undefined) {
    this.props.description = value;
  }

  /**
   * Get the quantity.
   */
  get quantity() {
    return this.props.quantity;
  }

  /**
   * Set the quantity.
   */
  set quantity(value: number | undefined) {
    this.props.quantity = value;
  }

  /**
   * Get the buyer identifier.
   */
  get buyerIdentifier() {
    return this.props.buyerIdentifier;
  }

  /**
   * Set the buyer identifier.
   */
  set buyerIdentifier(value: string | undefined) {
    this.props.buyerIdentifier = value;
  }

  /**
   * Get the seller identifier.
   */
  get sellerIdentifier() {
    return this.props.sellerIdentifier;
  }

  /**
   * Set the seller identifier.
   */
  set sellerIdentifier(value: string | undefined) {
    this.props.sellerIdentifier = value;
  }

  /**
   * Get the standard identifier.
   */
  get standardIdentifier() {
    return this.props.standardIdentifier;
  }

  /**
   * Set the standard identifier.
   */
  set standardIdentifier(value: string | undefined) {
    this.props.standardIdentifier = value;
  }

  /**
   * Get the origin country code.
   */
  get originCountryCode() {
    return this.props.originCountryCode;
  }

  /**
   * Set the origin country code.
   */
  set originCountryCode(value: string | undefined) {
    this.props.originCountryCode = value;
  }

  /**
   * Get the classification identifiers.
   */
  get classificationIdentifiers() {
    return this.props.classificationIdentifiers;
  }

  /**
   * Set the classification identifiers.
   */
  set classificationIdentifiers(value: Identifier[] | undefined) {
    this.props.classificationIdentifiers = value;
  }

  /**
   * Get the price.
   */
  get price() {
    return this.props.price;
  }

  /**
   * Set the price.
   */
  set price(value: number | undefined) {
    this.props.price = value;
  }

  /**
   * Get the net amount
   */
  get netAmount() {
    return this.props.netAmount;
  }

  /**
   * Set the net amount
   */
  set netAmount(value: number | undefined) {
    this.props.netAmount = value;
  }

  /**
   * Get the base quantity.
   */
  get baseQuantity() {
    return this.props.baseQuantity;
  }

  /**
   * Set the base quantity.
   */
  set baseQuantity(value: number | undefined) {
    this.props.baseQuantity = value;
  }

  /**
   * Get the attributes.
   */
  get attributes() {
    return this.props.attributes;
  }

  /**
   * Set the attributes.
   */
  set attributes(value: Attribute[] | undefined) {
    this.props.attributes = value;
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
   * Get the tax.
   */
  get tax() {
    return this.props.tax;
  }

  /**
   * Set the tax.
   */
  set tax(value: Tax | undefined) {
    this.props.tax = value;
  }

  toPrimitive() {
    return this.props;
  }
}
