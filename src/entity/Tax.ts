/**
 * Tax.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ITax, TaxId} from "../interface/ITax";
import {Entity} from "../base/Entity";

export default
class Tax extends Entity<ITax, string, TaxId> {
  public static create(props: ITax): Tax {
    return new Tax(props, props.id);
  }

  toPrimitive() {
    return this.props;
  }
}
