/**
 * Validation rulesets
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

import PeppolRuleset from "./ruleset/PeppolRuleset";
import AbstractRuleset from "./ruleset/AbstractRuleset";
import DKRuleset from "./ruleset/DKRuleset";

const rulesets = [
  new PeppolRuleset(),
  new DKRuleset(),
];

export function getRuleset(customizationId: string): AbstractRuleset {
  return rulesets.find(r => r.getCustomizationID() === customizationId);
}
