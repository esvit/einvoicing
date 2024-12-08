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

  /**
   * Get the payment terms.
   */
  get terms() {
    return this.props.terms;
  }

  /**
   * Set the payment terms.
   */
  set terms(value: string | undefined) {
    this.props.terms = value;
  }

  /**
   * Get the payment means code.
   */
  get meansCode() {
    return this.props.meansCode;
  }

  /**
   * Set the payment means code.
   */
  set meansCode(value: string | undefined) {
    this.props.meansCode = value;
  }

  /**
   * Get the payment means name.
   */
  get meansName() {
    return this.props.meansName;
  }

  /**
   * Set the payment means name.
   */
  set meansName(value: string | undefined) {
    this.props.meansName = value;
  }

  /**
   * Get the payment ID.
   */
  get id() {
    return this.props.id;
  }

  /**
   * Set the payment ID.
   */
  set id(value: string | undefined) {
    this.props.id = value;
  }

  /**
   * Get the payment card.
   */
  get card() {
    return this.props.card;
  }

  /**
   * Set the payment card.
   */
  set card(value: PaymentCard | undefined) {
    this.props.card = value;
  }

  /**
   * Get the payment transfer.
   */
  get transfer() {
    return this.props.transfer;
  }

  /**
   * Set the payment transfer.
   */
  set transfer(value: PaymentTransfer | undefined) {
    this.props.transfer = value;
  }

  /**
   * Get the payment mandate.
   */
  get mandate() {
    return this.props.mandate;
  }

  /**
   * Set the payment mandate.
   */
  set mandate(value: PaymentMandate | undefined) {
    this.props.mandate = value;
  }

  toPrimitive() {
    return this.props;
  }
}
