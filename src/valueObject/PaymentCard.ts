/**
 * PaymentCard.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ValueObject } from '../base/ValueObject';

export interface IPaymentCard {
  // BT-87: Card PAN
  pan?: string;

  // Card network
  network?: string;

  // BT-88: Holder name
  holder?: string;
}

export default class PaymentCard
  extends ValueObject<IPaymentCard>
  implements IPaymentCard
{
  public static create(props: IPaymentCard): PaymentCard {
    return new PaymentCard(props);
  }

  /**
   * Get the card PAN.
   */
  get pan() {
    return this.props.pan;
  }

  /**
   * Set the card PAN.
   */
  set pan(value: string | undefined) {
    this.props.pan = value;
  }

  /**
   * Get the card network.
   */
  get network() {
    return this.props.network;
  }

  /**
   * Set the card network.
   */
  set network(value: string | undefined) {
    this.props.network = value;
  }

  /**
   * Get the card holder name.
   */
  get holder() {
    return this.props.holder;
  }

  /**
   * Set the card holder name.
   */
  set holder(value: string | undefined) {
    this.props.holder = value;
  }

  toPrimitive() {
    return this.props;
  }
}
