/**
 * Delivery.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";
import DateOnly from "./DateOnly";
import Address from "./Address";

export interface IDelivery {
  // BT-70: Deliver name
  name?: string;

  // BT-72: Actual delivery date
  date?: DateOnly;

  // BT-71: Delivery location identifier
  locationId?: string;

  // Delivery postal address
  address?: Address;
}

export default
class Delivery extends ValueObject<IDelivery> {
  public static create(props: IDelivery): Delivery {
    return new Delivery(props);
  }

  toPrimitive() {
    return this.props;
  }
}
