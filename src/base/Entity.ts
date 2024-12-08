/**
 * Entity.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { EntityId } from './EntityId';

const isEntity = <T, E, M extends EntityId<E>>(v: Entity<T, E, M>): v is Entity<T, E, M> => {
  return v instanceof Entity
}

export abstract class Entity<T, E, H extends EntityId<E>> {
  protected readonly _id: H;
  protected props: T;

  protected constructor(props: T, id?: H|E) {
    if (id) {
      this._id = <H>(typeof id === 'object' ? id : new EntityId<E>(id));
    } else {
      this._id = <H>(new EntityId());
    }
    this.props = props
  }

  public equals(object?: Entity<T, E, H>): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!isEntity(object)) {
      return false
    }

    return this._id.equals(object._id);
  }

  get id(): H {
    return this._id
  }

  toPrimitive(): T {
    return this.props
  }

  toJSON(): T {
    return this.toPrimitive()
  }
}
