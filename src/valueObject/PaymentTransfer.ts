/**
 * PaymentTransfer.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ValueObject } from '../base/ValueObject';
import Identifier from './Identifier';

export interface IPaymentTransfer {
  // BT-84: Receiving account ID
  account?: string;

  // BT-85: Receiving account name
  name?: string;

  // BT-86: Service provider ID
  provider?: Identifier;
}

export default class PaymentTransfer extends ValueObject<IPaymentTransfer> {
  public static create(props: IPaymentTransfer): PaymentTransfer {
    return new PaymentTransfer(props);
  }

  /**
   * Get the receiving account ID.
   */
  get account() {
    return this.props.account;
  }

  /**
   * Set the receiving account ID.
   */
  set account(value: string | undefined) {
    this.props.account = value;
  }

  /**
   * Get the receiving account name.
   */
  get name() {
    return this.props.name;
  }

  /**
   * Set the receiving account name.
   */
  set name(value: string | undefined) {
    this.props.name = value;
  }

  /**
   * Get the service provider ID.
   */
  get provider() {
    return this.props.provider;
  }

  /**
   * Set the service provider ID.
   */
  set provider(value: Identifier | undefined) {
    this.props.provider = value;
  }

  toPrimitive() {
    return this.props;
  }
}
