/**
 * DateOnly.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

export default
class DateOnly extends ValueObject<{ date: string }> {
  public static create(date: string): DateOnly {
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error('Invalid date format');
    }
    return new DateOnly({ date });
  }

  toPrimitive(): string {
    return this.props.date;
  }
}
