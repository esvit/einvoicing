import { ValueObject } from '../base/ValueObject';

export interface IContact {
  name?: string;
  email?: string;
  phone?: string;
}

export default class Contact extends ValueObject<IContact> {
  public static create(props: IContact): Contact {
    return new Contact(props);
  }

  /**
   * Get the name.
   */
  get name() {
    return this.props.name;
  }

  /**
   * Set the name.
   */
  set name(value: string | undefined) {
    this.props.name = value;
  }

  /**
   * Get the email.
   */
  get email() {
    return this.props.email;
  }

  /**
   * Set the email.
   */
  set email(value: string | undefined) {
    this.props.email = value;
  }

  /**
   * Get the phone.
   */
  get phone() {
    return this.props.phone;
  }

  /**
   * Set the phone.
   */
  set phone(value: string | undefined) {
    this.props.phone = value;
  }
}
