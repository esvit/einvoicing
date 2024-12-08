/**
 * Document.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {Entity} from "../base/Entity";
import {IDocument, DocumentId} from "../interface/IDocument";

export default
class Document extends Entity<IDocument, string, DocumentId> {
  public static create(props: IDocument): Document {
    return new Document(props, props.id);
  }

  get attachments() {
    return this.props.attachments;
  }

  get dueDate() {
    return this.props.dueDate;
  }

  toPrimitive() {
    return this.props;
  }
}
