/**
 * Payee.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

export interface IPayee {
  name?: string;
  companyId?: string;
  additionalIdentifiers: string[];
}

export default
class Payee extends ValueObject<IPayee> {
  public static create(props: IPayee): Payee {
    return new Payee(props);
  }

  toPrimitive() {
    return this.props;
  }
}
