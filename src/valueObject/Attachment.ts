/**
 * Attachment.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";
import BinaryObject from "./BinaryObject";

export interface IAttachment {
  id?: string;
  description?: string;
  externalUri?: string;
  content?: BinaryObject;
}

export default
class Attachment extends ValueObject<IAttachment> {
  public static create(ref: IAttachment): Attachment {
    return new Attachment(ref);
  }

  toPrimitive() {
    return this.props;
  }
}
