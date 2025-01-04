/**
 * PeppolRuleset.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

import AbstractRuleset, {IValidationResult} from "./AbstractRuleset";
import {promises as fs} from "fs";
import Document from '../entity/Document';
import {Schema} from "esvit-node-schematron";
import UblWriter from "../writers/UblWriter";

export default
class InvoiceUBLRuleset extends AbstractRuleset {
  getCustomizationID(): string {
    return 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0';
  }

  get rules() {
    return {};
  }

  async validate(document: Document): Promise<IValidationResult> {
    const content = await fs.readFile(`${__dirname}/../../schema/en16931-ubl-1.3.13/schematron/EN16931-UBL-validation.sch`, 'utf8');
    const schema = Schema.fromString(content, {
      resourceDir: `${__dirname}/../../schema/en16931-ubl-1.3.13/schematron/`,
    });
    const writer = new UblWriter();
    const xml = writer.write(document);

    const results = schema.validateString(xml, {
      // phaseId: 'EN16931model_phase',
      phaseId: 'codelist_phase',
      debug: true
    });
    return {
      errors: results.map(result => ({ key: result.assertId, message: result.message })),
      warnings: []
    };
  }
}
