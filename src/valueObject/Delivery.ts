/**
 * Delivery.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ValueObject } from '../base/ValueObject';
import DateOnly from './DateOnly';
import Address from './Address';
import Identifier from './Identifier';

export interface IDelivery {
  // BT-70: Deliver name
  name?: string;

  // BT-72: Actual delivery date
  date?: DateOnly;

  // BT-71: Delivery location identifier
  locationId?: Identifier;

  // Delivery postal address
  address?: Address;
}

export default class Delivery
  extends ValueObject<IDelivery>
  implements IDelivery
{
  public static create(props: IDelivery): Delivery {
    return new Delivery(props);
  }

  /**
   * Get the delivery name.
   */
  get name() {
    return this.props.name;
  }

  /**
   * Set the delivery name.
   */
  set name(value: string | undefined) {
    this.props.name = value;
  }

  /**
   * Get the actual delivery date.
   */
  get date() {
    return this.props.date;
  }

  /**
   * Set the actual delivery date.
   */
  set date(value: DateOnly | undefined) {
    this.props.date = value;
  }

  /**
   * Get the delivery location identifier.
   */
  get locationId() {
    return this.props.locationId;
  }

  /**
   * Set the delivery location identifier.
   */
  set locationId(value: Identifier | undefined) {
    this.props.locationId = value;
  }

  /**
   * Get the delivery postal address.
   */
  get address() {
    return this.props.address;
  }

  /**
   * Set the delivery postal address.
   */
  set address(value: Address | undefined) {
    this.props.address = value;
  }

  toPrimitive() {
    return this.props;
  }
}
