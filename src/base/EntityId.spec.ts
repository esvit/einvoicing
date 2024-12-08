import { EntityId } from './EntityId';
import {HashError} from "../error/HashError";

class TestId extends EntityId<number> {
}

class Test2Id extends EntityId<string> {
}

describe('ValueObject', () => {
  test('base', async () => {
    const id = new TestId(1);
    const id2 = new EntityId('1');
    const id3 = new TestId(1);
    expect(id).toEqual(id3);
    expect(id).not.toEqual(id2);

    const id4 = new Test2Id('9KdMR', true);
    expect(id4.toPrimitive()).toEqual('123')
  });
  test('fromHash', async () => {
    expect.assertions(4);

    expect((new Test2Id(undefined, true)).toPrimitive()).toEqual(null);
    expect((new Test2Id(null, true)).toPrimitive()).toEqual(null);

    try {
      new Test2Id('123', true)
    } catch (err) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err).toBeInstanceOf(HashError);
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err.message).toEqual('Invalid hash 123');
    }
  });
  test('toHash', async () => {
    const id = new Test2Id('123');
    expect(id.toHash()).toEqual('9KdMR');
    expect(id.fromHash('VLoxm').toPrimitive()).toEqual('1');
    expect(id.toPrimitive()).toEqual('1');
    expect(id.toString()).toEqual('090bb5d1-267b-5967-84c8-95bc1bda380f');

    const id2 = new TestId(123);
    expect(id2.toHash()).toEqual('BJejP');
    expect(id2.fromHash('BJejP').toPrimitive()).toEqual(123);

    const id3 = new Test2Id();
    expect(() => id3.toHash()).toThrow('Cannot hash an empty recordId');
  });
});
