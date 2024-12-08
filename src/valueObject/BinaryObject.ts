/**
 * BinaryObject.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

export interface IBinaryObject {
  mimeCode?: string; // example: text/csv
  filename?: string;
  content?: string; // raw content
}

export default
class BinaryObject extends ValueObject<IBinaryObject> {
  public static create(ref: IBinaryObject): BinaryObject {
    return new BinaryObject(ref);
  }

  public static createFromBase64(ref: Omit<IBinaryObject, 'content'> & { base64?: string }): BinaryObject {
    return new BinaryObject({
      filename: ref.filename,
      mimeCode: ref.mimeCode,
      content: ref.base64 ? atob(ref.base64) : undefined
    });
  }

  toPrimitive() {
    return this.props;
  }
}
