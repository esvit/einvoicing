/**
 * Attachment.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";
import BinaryObject from "./BinaryObject";

export interface IAttachment {
  id?: string;
  description?: string;
  externalUri?: string;
  content?: BinaryObject;

  /**
   * Get the attachment ID.
   */
  get id(): string | undefined;

  /**
   * Set the attachment ID.
   */
  set id(value: string | undefined);

  /**
   * Get the attachment description.
   */
  get description(): string | undefined;

  /**
   * Set the attachment description.
   */
  set description(value: string | undefined);

  /**
   * Get the external URI.
   */
  get externalUri(): string | undefined;

  /**
   * Set the external URI.
   */
  set externalUri(value: string | undefined);

  /**
   * Get the content.
   */
  get content(): BinaryObject | undefined;

  /**
   * Set the content.
   */
  set content(value: BinaryObject | undefined);
}

export default
class Attachment extends ValueObject<IAttachment> implements IAttachment {
  public static create(ref: IAttachment): Attachment {
    return new Attachment(ref);
  }

  /**
   * Get the attachment ID.
   */
  get id() {
    return this.props.id;
  }

  /**
   * Set the attachment ID.
   */
  set id(value: string | undefined) {
    this.props.id = value;
  }

  /**
   * Get the attachment description.
   */
  get description() {
    return this.props.description;
  }

  /**
   * Set the attachment description.
   */
  set description(value: string | undefined) {
    this.props.description = value;
  }

  /**
   * Get the external URI.
   */
  get externalUri() {
    return this.props.externalUri;
  }

  /**
   * Set the external URI.
   */
  set externalUri(value: string | undefined) {
    this.props.externalUri = value;
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
  set content(value: BinaryObject | undefined) {
    this.props.content = value;
  }

  toPrimitive() {
    return this.props;
  }
}
