/**
 * Party.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";
import Address from "./Address";

export interface IParty {
  endpointId?: string;
  address?: Address;
  legalName?: string;
  companyId?: string;
  tradingName?: string;
  companyLegalForm?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  additionalIdentifiers?: string[],
  vatNumber?: string;
  taxRegistrationId?: { companyId?: string, taxScheme?: string };
}

export default
class Party extends ValueObject<IParty> {
  public static create(props: IParty): Party {
    return new Party(props);
  }

  toPrimitive() {
    return this.props;
  }
}
