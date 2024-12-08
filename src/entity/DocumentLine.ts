/**
 * DocumentLine.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {Entity} from "../base/Entity";
import {DocumentLineId, IDocumentLine} from "../interface/IDocumentLine";

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
   * Get the unit price.
   */
  get unitPrice() {
    return this.props.unitPrice;
  }

  /**
   * Set the unit price.
   */
  set unitPrice(value: number | undefined) {
    this.props.unitPrice = value;
  }

  /**
   * Get the line extension amount.
   */
  get lineExtensionAmount() {
    return this.props.lineExtensionAmount;
  }

  /**
   * Set the line extension amount.
   */
  set lineExtensionAmount(value: number | undefined) {
    this.props.lineExtensionAmount = value;
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
