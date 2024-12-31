import { Entity } from './Entity';
import { EntityId } from './EntityId';

interface TestProps {
  name: string;
}
class TestEntity extends Entity<TestProps, number, EntityId<number>> {
  static create(props: TestProps, id?: EntityId<number> | number): TestEntity {
    return new TestEntity(props, id);
  }
}

describe('Entity', () => {
  let entity: TestEntity;

  beforeAll(() => {
    entity = TestEntity.create({ name: 'test' }, 1);
  });

  test('base', async () => {
    const entityNew = TestEntity.create({ name: 'test2' });
    expect(entityNew.id.toString().length).toEqual(36); // random id

    const entity2 = TestEntity.create({ name: 'test2' }, 1);
    expect(entity.equals(entity2)).toBeTruthy(); // same id
    expect(entity.equals(entity)).toBeTruthy(); // same instance
    expect(entity.equals(null)).toBeFalsy(); // null
    expect(entity.equals(<TestEntity>{ id: new EntityId(1) })).toBeFalsy(); // not Entity
    expect(entity.id.toPrimitive()).toEqual(1);
    expect(entity.id.toString()).toEqual(
      '6061cf31-edcb-5d22-9adc-927af7c186fa',
    );

    const entity3 = TestEntity.create({ name: 'test2' }, entity.id);
    expect(entity.equals(entity3)).toBeTruthy(); // same id
    expect(entity3.id.toPrimitive()).toEqual(1);
    expect(entity3.id.toString()).toEqual(
      '6061cf31-edcb-5d22-9adc-927af7c186fa',
    );
  });
});
