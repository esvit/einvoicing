/**
 * PaymentMandate.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ValueObject } from '../base/ValueObject';

export interface IPaymentMandate {
  // BT-89: Mandate reference
  reference?: string;

  // BT-91: Debited account
  account?: string;
}

export default class PaymentMandate extends ValueObject<IPaymentMandate> {
  public static create(props: IPaymentMandate): PaymentMandate {
    return new PaymentMandate(props);
  }

  /**
   * Get the mandate reference.
   */
  get reference() {
    return this.props.reference;
  }

  /**
   * Set the mandate reference.
   */
  set reference(value: string | undefined) {
    this.props.reference = value;
  }

  /**
   * Get the debited account.
   */
  get account() {
    return this.props.account;
  }

  /**
   * Set the debited account.
   */
  set account(value: string | undefined) {
    this.props.account = value;
  }

  toPrimitive() {
    return this.props;
  }
}
