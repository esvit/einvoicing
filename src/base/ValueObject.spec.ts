import { ValueObject } from './ValueObject';

interface TestProps {
  name: string;
}
class TestValueObject extends ValueObject<TestProps> {
  static create(props: TestProps): TestValueObject {
    return new TestValueObject(props);
  }
}

describe('ValueObject', () => {
  let entity: TestValueObject;

  beforeAll(() => {
    entity = TestValueObject.create({ name: 'test' });
  });

  test('base', async () => {
    const entity2 = TestValueObject.create({ name: 'test2' });
    expect(entity.equals(entity2)).toBeFalsy(); // same id
    expect(entity.equals(entity)).toBeTruthy(); // same instance
    expect(entity.equals(null)).toBeFalsy(); // null
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    expect(entity.equals(<any>{ name: 'test' })).toBeTruthy(); // same fields
  });
});
