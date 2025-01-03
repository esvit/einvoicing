/**
 * AllowanceCharge.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ValueObject } from '../base/ValueObject';
import Tax from '../entity/Tax';

export interface IAllowanceCharge {
  isCharge?: boolean;
  reasonCode?: string;
  reasonText?: string;
  factorAmount?: number;
  baseAmount?: number;
  amount?: number;
  tax?: Tax;
}

export default class AllowanceCharge extends ValueObject<IAllowanceCharge> {
  public static create(ref: IAllowanceCharge): AllowanceCharge {
    if (!ref.amount && !ref.factorAmount) {
      throw new Error('Either amount or factorAmount must be provided');
    }
    return new AllowanceCharge(ref);
  }

  get isPercentage() {
    return this.props.factorAmount !== undefined;
  }

  /**
   * Get whether it is a charge.
   */
  get isCharge() {
    return this.props.isCharge;
  }

  /**
   * Set whether it is a charge.
   */
  set isCharge(value: boolean | undefined) {
    this.props.isCharge = value;
  }

  /**
   * Get the reason code.
   */
  get reasonCode() {
    return this.props.reasonCode;
  }

  /**
   * Set the reason code.
   */
  set reasonCode(value: string | undefined) {
    this.props.reasonCode = value;
  }

  /**
   * Get the reason text.
   */
  get reasonText() {
    return this.props.reasonText;
  }

  /**
   * Set the reason text.
   */
  set reasonText(value: string | undefined) {
    this.props.reasonText = value;
  }

  /**
   * Get the factor amount.
   */
  get factorAmount() {
    return this.props.factorAmount;
  }

  /**
   * Set the factor amount.
   */
  set factorAmount(value: number | undefined) {
    this.props.factorAmount = value;
  }

  /**
   * Get the base amount.
   */
  get baseAmount() {
    return this.props.baseAmount;
  }

  /**
   * Set the base amount.
   */
  set baseAmount(value: number | undefined) {
    this.props.baseAmount = value;
  }

  /**
   * Get the amount.
   */
  get amount() {
    return this.props.amount;
  }

  /**
   * Set the amount.
   */
  set amount(value: number | undefined) {
    this.props.amount = value;
  }

  /**
   * Get the tax.
   */
  get tax() {
    return this.props.tax;
  }

  /**
   * Set the tax.
   */
  set tax(value: Tax | undefined) {
    this.props.tax = value;
  }

  toPrimitive() {
    return this.props;
  }
}
