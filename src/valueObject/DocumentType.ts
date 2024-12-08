/**
 * DocumentType.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

// https://docs.peppol.eu/poacc/billing/3.0/2024-Q2/codelist/UNCL1001-inv/
export default
class DocumentType extends ValueObject<{ type: number }> {
  public static create(type: number|string): DocumentType {
    return new DocumentType({
      type: Number(type)
    });
  }

  toPrimitive() {
    return this.props.type;
  }
}