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

  toPrimitive() {
    return this.props;
  }
}
