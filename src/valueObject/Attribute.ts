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

  toPrimitive() {
    return this.props;
  }
}
