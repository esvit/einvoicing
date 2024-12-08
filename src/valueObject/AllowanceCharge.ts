/**
 * AllowanceCharge.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";
import Tax from "../entity/Tax";

export interface IAllowanceCharge {
  isCharge?: boolean;
  reasonCode?: string;
  reasonText?: string;
  factorAmount?: number;
  amount?: number;
  tax?: Tax;
}

export default
class AllowanceCharge extends ValueObject<IAllowanceCharge> {
  public static create(ref: IAllowanceCharge): AllowanceCharge {
    if (!ref.amount && !ref.factorAmount) {
      throw new Error('Either amount or factorAmount must be provided');
    }
    return new AllowanceCharge(ref);
  }

  toPrimitive() {
    return this.props;
  }
}
