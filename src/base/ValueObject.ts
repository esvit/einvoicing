/**
 * ValueObject.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    const props = vo?.props || vo;
    if (vo === null || vo === undefined) {
      return false;
    }
    if (props === undefined) {
      return false;
    }
    return shallowEqual(this.props, props);
  }
}
