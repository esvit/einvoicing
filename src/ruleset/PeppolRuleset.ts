/**
 * PeppolRuleset.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

import AbstractRuleset from './AbstractRuleset';

export default class PeppolRuleset extends AbstractRuleset {
  getCustomizationID(): string {
    return 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0';
  }

  get rules() {
    return {};
  }
}
