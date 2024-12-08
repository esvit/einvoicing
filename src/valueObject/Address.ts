/**
 * Address.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

import {ValueObject} from "../base/ValueObject";

export interface IAddress {
  countryCode?: string;
  subdivision?: string;
  cityName?: string;
  postalZone?: string;
  streetName?: string;
  addressLines?: string[];
}

export default
class Address extends ValueObject<IAddress> {
  public static create(props: IAddress): Address {
    return new Address(props);
  }

  toPrimitive() {
    return this.props;
  }
}
