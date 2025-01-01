import { ValueObject } from '../base/ValueObject';
import Identifier from './Identifier';

export interface ITaxRegistration {
  id?: Identifier;
  scheme?: string;
}

export default class TaxRegistration extends ValueObject<ITaxRegistration> {
  public static create({
    id,
    scheme = 'VAT',
  }: ITaxRegistration): TaxRegistration {
    return new TaxRegistration({
      id,
      scheme,
    });
  }

  /**
   * Get the id.
   */
  get id() {
    return this.props.id;
  }

  /**
   * Set the id.
   */
  set id(value: Identifier | undefined) {
    this.props.id = value;
  }

  /**
   * Get the scheme.
   */
  get scheme() {
    return this.props.scheme;
  }

  /**
   * Set the scheme.
   */
  set scheme(value: string | undefined) {
    this.props.scheme = value;
  }
}
