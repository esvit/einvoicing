/**
 * Attribute.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

export interface IAttribute {
  name: string;
  value: string;
}

export default
class Attribute extends ValueObject<IAttribute> {
  public static create(ref: IAttribute): Attribute {
    return new Attribute(ref);
  }

  /**
   * Get the attribute name.
   */
  get name() {
    return this.props.name;
  }

  /**
   * Set the attribute name.
   */
  set name(value: string) {
    this.props.name = value;
  }

  /**
   * Get the attribute value.
   */
  get value() {
    return this.props.value;
  }

  /**
   * Set the attribute value.
   */
  set value(value: string) {
    this.props.value = value;
  }

  toPrimitive() {
    return this.props;
  }
}
