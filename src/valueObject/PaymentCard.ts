/**
 * PaymentCard.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

export interface IPaymentCard {
  // BT-87: Card PAN
  pan?: string;

  // Card network
  network?: string;

  // BT-88: Holder name
  holder?: string;
}

export default
class PaymentCard extends ValueObject<IPaymentCard> {
  public static create(props: IPaymentCard): PaymentCard {
    return new PaymentCard(props);
  }

  toPrimitive() {
    return this.props;
  }
}
