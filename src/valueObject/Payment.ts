/**
 * Payment.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";
import PaymentMandate from "./PaymentMandate";
import PaymentTransfer from "./PaymentTransfer";
import PaymentCard from "./PaymentCard";

export interface IPayment {
  // BT-20: Payment terms
  terms?: string;

  // BT-81: Payment means code
  meansCode?: string;

  // BT-82: Payment means name
  meansName?: string;

  // BT-83: Payment ID
  id?: string;

  // BG-18: Payment card
  card?: PaymentCard;

  // BG-17: Payment transfers
  transfer?: PaymentTransfer;

  // BG-19: Payment mandate
  mandate?: PaymentMandate;
}

export default
class Payment extends ValueObject<IPayment> {
  public static create(props: IPayment): Payment {
    return new Payment(props);
  }

  toPrimitive() {
    return this.props;
  }
}
