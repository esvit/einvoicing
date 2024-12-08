/**
 * PaymentMandate.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

export interface IPaymentMandate {
  // BT-89: Mandate reference
  reference?: string;

  // BT-91: Debited account
  account?: string;
}

export default
class PaymentMandate extends ValueObject<IPaymentMandate> {
  public static create(props: IPaymentMandate): PaymentMandate {
    return new PaymentMandate(props);
  }

  toPrimitive() {
    return this.props;
  }
}
