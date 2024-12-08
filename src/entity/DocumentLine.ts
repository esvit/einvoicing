/**
 * DocumentLine.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {Entity} from "../base/Entity";
import {DocumentLineId, IDocumentLine} from "../interface/IDocumentLine";

export default
class DocumentLine extends Entity<IDocumentLine, string, DocumentLineId> {
  public static create(props: IDocumentLine): DocumentLine {
    return new DocumentLine(props, props.id);
  }

  toPrimitive() {
    return this.props;
  }
}
