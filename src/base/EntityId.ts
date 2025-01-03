/**
 * EntityId.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import createUUID from 'uuid-by-string';
import { createId } from '@paralleldrive/cuid2';
import Hashids from 'hashids';
import { HashError } from '../error/HashError';

export class EntityId<T> {
  protected _recordId: T | null = null;
  protected _uuid: string = null;

  constructor(recordId: T = null, isHash = false, uuid: string = null) {
    this._recordId = recordId ? recordId : null;
    if (isHash) {
      this.fromHash(recordId as string);
    }
    if (!uuid) {
      this.createUUID();
    }
  }

  private createUUID(): void {
    this._uuid = createUUID(
      this._recordId ? this._recordId.toString() : createId(),
      createUUID(this.constructor.name),
    );
  }

  get hashOptions(): [string, number] {
    return [this.constructor.name, 5];
  }

  toHash(): string {
    if (!this._recordId) {
      throw new Error('Cannot hash an empty recordId');
    }
    const hashids = new Hashids(...this.hashOptions);
    return hashids.encode(this.toPrimitive().toString());
  }

  fromHash(hash: string): EntityId<T> {
    if (!hash) {
      return this;
    }
    const hashids = new Hashids(...this.hashOptions);
    const num = hashids.decode(hash)[0];
    if (!num) {
      throw new HashError(`Invalid hash ${hash}`);
    }
    this._recordId = <T>(
      (typeof this._recordId === 'string' ? num.toString() : num)
    );
    this.createUUID();
    return this;
  }

  toPrimitive(): T {
    return this._recordId;
  }

  toString(): string {
    return this._uuid;
  }

  equals(id: EntityId<T>): boolean {
    return this._uuid === id._uuid;
  }
}
