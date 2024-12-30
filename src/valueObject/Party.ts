/**
 * Party.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ValueObject } from '../base/ValueObject';
import Address from './Address';
import Contact from './Contact';
import Identifier from './Identifier';

export interface IParty {
  endpointId?: Identifier;
  address?: Address;
  legalName?: string;
  companyId?: Identifier;
  tradingName?: string;
  companyLegalForm?: string;
  contact?: Contact;
  additionalIdentifiers?: Identifier[];
  vatNumber?: string;
  taxRegistrationId?: { companyId?: string; taxScheme?: string };
}

export default class Party extends ValueObject<IParty> {
  public static create(props: IParty): Party {
    return new Party(props);
  }

  /**
   * Get the endpoint ID.
   */
  get endpointId() {
    return this.props.endpointId;
  }

  /**
   * Set the endpoint ID.
   */
  set endpointId(value: Identifier | undefined) {
    this.props.endpointId = value;
  }

  /**
   * Get the address.
   */
  get address() {
    return this.props.address;
  }

  /**
   * Set the address.
   */
  set address(value: Address | undefined) {
    this.props.address = value;
  }

  /**
   * Get the legal name.
   */
  get legalName() {
    return this.props.legalName;
  }

  /**
   * Set the legal name.
   */
  set legalName(value: string | undefined) {
    this.props.legalName = value;
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
  set companyId(value: Identifier | undefined) {
    this.props.companyId = value;
  }

  /**
   * Get the trading name.
   */
  get tradingName() {
    return this.props.tradingName;
  }

  /**
   * Set the trading name.
   */
  set tradingName(value: string | undefined) {
    this.props.tradingName = value;
  }

  /**
   * Get the company legal form.
   */
  get companyLegalForm() {
    return this.props.companyLegalForm;
  }

  /**
   * Set the company legal form.
   */
  set companyLegalForm(value: string | undefined) {
    this.props.companyLegalForm = value;
  }

  /**
   * Get the contact.
   */
  get contact() {
    return this.props.contact;
  }

  /**
   * Set the contact name.
   */
  set contact(value: Contact | undefined) {
    this.props.contact = value;
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
  set additionalIdentifiers(value: Identifier[] | undefined) {
    this.props.additionalIdentifiers = value;
  }

  /**
   * Get the VAT number.
   */
  get vatNumber() {
    return this.props.vatNumber;
  }

  /**
   * Set the VAT number.
   */
  set vatNumber(value: string | undefined) {
    this.props.vatNumber = value;
  }

  /**
   * Get the tax registration ID.
   */
  get taxRegistrationId() {
    return this.props.taxRegistrationId;
  }

  /**
   * Set the tax registration ID.
   */
  set taxRegistrationId(
    value: { companyId?: string; taxScheme?: string } | undefined,
  ) {
    this.props.taxRegistrationId = value;
  }

  toPrimitive() {
    return this.props;
  }
}
