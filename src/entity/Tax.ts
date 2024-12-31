/**
 * Tax.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ITax, TaxId } from '../interface/ITax';
import { Entity } from '../base/Entity';
import CurrencyCode from '../valueObject/CurrencyCode';

export default class Tax extends Entity<ITax, string, TaxId> {
  public static create(props: ITax): Tax {
    return new Tax(props, props.id);
  }

  /**
   * Get the tax ID.
   */
  get id() {
    return this.props.id;
  }

  /**
   * Set the tax ID.
   */
  set id(value: TaxId) {
    this.props.id = value;
  }

  /**
   * Get the currency.
   */
  get currency() {
    return this.props.currency;
  }

  /**
   * Set the currency.
   */
  set currency(value: CurrencyCode | undefined) {
    this.props.currency = value;
  }

  /**
   * Get the taxable amount.
   */
  get taxableAmount() {
    return this.props.taxableAmount;
  }

  /**
   * Set the taxable amount.
   */
  set taxableAmount(value: number | undefined) {
    this.props.taxableAmount = value;
  }

  /**
   * Get the tax amount.
   */
  get taxAmount() {
    return this.props.taxAmount;
  }

  /**
   * Set the tax amount.
   */
  set taxAmount(value: number | undefined) {
    this.props.taxAmount = value;
  }

  /**
   * Get the percent.
   */
  get percent() {
    return this.props.percent;
  }

  /**
   * Set the percent.
   */
  set percent(value: number | undefined) {
    this.props.percent = value;
  }

  /**
   * Get the tax exemption reason.
   */
  get taxExemptionReason() {
    return this.props.taxExemptionReason;
  }

  /**
   * Set the tax exemption reason.
   */
  set taxExemptionReason(value: string | undefined) {
    this.props.taxExemptionReason = value;
  }

  /**
   * Get the tax exemption reason code.
   */
  get taxExemptionReasonCode() {
    return this.props.taxExemptionReasonCode;
  }

  /**
   * Set the tax exemption reason code.
   */
  set taxExemptionReasonCode(value: string | undefined) {
    this.props.taxExemptionReasonCode = value;
  }

  toPrimitive() {
    return this.props;
  }
}
