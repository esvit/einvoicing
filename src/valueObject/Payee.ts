/**
 * Payee.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
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

  /**
   * Get the payee name.
   */
  get name() {
    return this.props.name;
  }

  /**
   * Set the payee name.
   */
  set name(value: string | undefined) {
    this.props.name = value;
  }

  /**
   * Get the company ID.
   */
  get companyId() {
    return this.props.companyId;
  }

  /**
   * Set the company ID.
   */
  set companyId(value: string | undefined) {
    this.props.companyId = value;
  }

  /**
   * Get the additional identifiers.
   */
  get additionalIdentifiers() {
    return this.props.additionalIdentifiers;
  }

  /**
   * Set the additional identifiers.
   */
  set additionalIdentifiers(value: string[]) {
    this.props.additionalIdentifiers = value;
  }

  toPrimitive() {
    return this.props;
  }
}
