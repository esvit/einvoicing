import { ValueObject } from '../base/ValueObject';
import { formatNumber } from '../helpers';

export interface IQuantity {
  value: number;
  unitCode?: string;
}

export default class Quantity extends ValueObject<IQuantity> {
  public static create(props: IQuantity): Quantity {
    return new Quantity(props);
  }

  /**
   * Get the quantity value.
   */
  get value() {
    return this.props.value;
  }

  /**
   * Set the quantity value.
   */
  set value(value: number) {
    this.props.value = value;
  }

  /**
   * Get the quantity unit code.
   */
  get unitCode() {
    return this.props.unitCode;
  }

  /**
   * Set the quantity unit code.
   */
  set unitCode(value: string) {
    this.props.unitCode = value;
  }

  toPrimitive() {
    const value = {
      '#text': formatNumber(this.value),
    };

    if (this.unitCode) {
      value['attr_unitCode'] = this.unitCode;
    }

    return value;
  }
}
