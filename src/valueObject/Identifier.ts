/**
 * Identifier.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ValueObject } from '../base/ValueObject';

export interface IIdentifier {
  id: string;
  scheme?: string;
}

export default class Identifier extends ValueObject<IIdentifier> {
  public static create(props: IIdentifier): Identifier {
    return new Identifier(props);
  }

  /**
   * Get the identifier ID.
   */
  get id() {
    return this.props.id;
  }

  /**
   * Set the identifier ID.
   */
  set id(value: string) {
    this.props.id = value;
  }

  /**
   * Get the identifier scheme.
   */
  get scheme() {
    return this.props.scheme;
  }

  /**
   * Set the identifier scheme.
   */
  set scheme(value: string) {
    this.props.scheme = value;
  }

  toPrimitive() {
    const value = {
      '#text': this.id,
    };

    if (this.scheme) {
      value['attr_schemeID'] = this.scheme;
    }

    return value;
  }
}
