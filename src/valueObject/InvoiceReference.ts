/**
 * InvoiceReference.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";
import DateOnly from "./DateOnly";

export interface IInvoiceReference {
  id: string;
  issueDate?: DateOnly;
}

export default
class InvoiceReference extends ValueObject<IInvoiceReference> {
  public static create(ref: IInvoiceReference): InvoiceReference {
    return new InvoiceReference(ref);
  }

  /**
   * Get the invoice reference ID.
   */
  get id() {
    return this.props.id;
  }

  /**
   * Set the invoice reference ID.
   */
  set id(value: string) {
    this.props.id = value;
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

  toPrimitive() {
    return this.props;
  }
}
