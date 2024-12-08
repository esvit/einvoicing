/**
 * DKRuleset.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

import AbstractRuleset, {IRule} from "./AbstractRuleset";
import Document from "../entity/Document";

export default
class DKRuleset extends AbstractRuleset {
  getCustomizationID(): string {
    return 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0';
  }

  get rules() {
    return {
      'DK-R-002': <IRule>{ type: 'error', message: 'Danish suppliers MUST provide legal entity (CVR-number)', test: (document: Document) => !!document.seller?.companyId },
    };
  }
}
