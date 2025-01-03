/**
 * BinaryObject.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { ValueObject } from '../base/ValueObject';

export interface IBinaryObject {
  mimeCode?: string; // example: text/csv
  filename?: string;
  content?: string; // raw content
}

export default class BinaryObject extends ValueObject<IBinaryObject> {
  public static create(ref: IBinaryObject): BinaryObject {
    return new BinaryObject(ref);
  }

  public static createFromBase64(
    ref: Omit<IBinaryObject, 'content'> & { base64?: string },
  ): BinaryObject {
    return new BinaryObject({
      filename: ref.filename,
      mimeCode: ref.mimeCode,
      content: ref.base64 ? atob(ref.base64) : undefined,
    });
  }

  /**
   * Get the MIME code.
   */
  get mimeCode() {
    return this.props.mimeCode;
  }

  /**
   * Set the MIME code.
   */
  set mimeCode(value: string | undefined) {
    this.props.mimeCode = value;
  }

  /**
   * Get the filename.
   */
  get filename() {
    return this.props.filename;
  }

  /**
   * Set the filename.
   */
  set filename(value: string | undefined) {
    this.props.filename = value;
  }

  /**
   * Get the content.
   */
  get content() {
    return this.props.content;
  }

  /**
   * Set the content.
   */
  set content(value: string | undefined) {
    this.props.content = value;
  }

  toPrimitive() {
    return this.props;
  }
}
