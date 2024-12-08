/**
 * Identifier.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

export interface IIdentifier {
  id: string;
  scheme: string;
}

export default
class Identifier extends ValueObject<IIdentifier> {
  public static create(props: IIdentifier): Identifier {
    return new Identifier(props);
  }

  toPrimitive() {
    return this.props;
  }
}
