/**
 * Validation rulesets
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

import PeppolRuleset from "./ruleset/PeppolRuleset";
import AbstractRuleset from "./ruleset/AbstractRuleset";

const rulesets = [
  new PeppolRuleset()
];

export function getRuleset(customizationId: string): AbstractRuleset {
  return rulesets.find(r => r.getCustomizationID() === customizationId);
}
