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

  /**
   * Get the country code.
   */
  get countryCode() {
    return this.props.countryCode;
  }

  /**
   * Set the country code.
   */
  set countryCode(value: string | undefined) {
    this.props.countryCode = value;
  }

  /**
   * Get the subdivision.
   */
  get subdivision() {
    return this.props.subdivision;
  }

  /**
   * Set the subdivision.
   */
  set subdivision(value: string | undefined) {
    this.props.subdivision = value;
  }

  /**
   * Get the city name.
   */
  get cityName() {
    return this.props.cityName;
  }

  /**
   * Set the city name.
   */
  set cityName(value: string | undefined) {
    this.props.cityName = value;
  }

  /**
   * Get the postal zone.
   */
  get postalZone() {
    return this.props.postalZone;
  }

  /**
   * Set the postal zone.
   */
  set postalZone(value: string | undefined) {
    this.props.postalZone = value;
  }

  /**
   * Get the street name.
   */
  get streetName() {
    return this.props.streetName;
  }

  /**
   * Set the street name.
   */
  set streetName(value: string | undefined) {
    this.props.streetName = value;
  }

  /**
   * Get the address lines.
   */
  get addressLines() {
    return this.props.addressLines;
  }

  /**
   * Set the address lines.
   */
  set addressLines(value: string[] | undefined) {
    this.props.addressLines = value;
  }

  toPrimitive() {
    return this.props;
  }
}
