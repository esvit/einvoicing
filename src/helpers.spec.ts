import { getArray, numOrUnd, strOrUnd } from './helpers';

describe('helpers', () => {
  test('strOrUnd', () => {
    expect(strOrUnd(null)).toBe(undefined);
    expect(strOrUnd(undefined)).toBe(undefined);
    expect(strOrUnd({ '#text': 'test' })).toBe('test');
    expect(() => strOrUnd({})).toThrow('Invalid node');
  });

  test('numOrUnd', () => {
    expect(numOrUnd(null)).toBe(undefined);
    expect(numOrUnd(undefined)).toBe(undefined);
    expect(numOrUnd({ '#text': '1' })).toBe(1);
    expect(() => strOrUnd({})).toThrow('Invalid node');
  });

  test('getArray', () => {
    const node1 = {
      'cac:TaxTotal': {
        'cac:TaxSubtotal': {
          'cbc:TaxableAmount': 1,
        },
      },
    };
    const node2 = {
      'cac:TaxTotal': {
        'cac:TaxSubtotal': [
          {
            'cbc:TaxableAmount': 1,
          },
          {
            'cbc:TaxableAmount': 2,
          },
        ],
      },
    };
    expect(getArray(node1, ['cac:TaxTotal', 'cac:TaxSubtotal'])).toEqual([
      {
        'cbc:TaxableAmount': 1,
      },
    ]);
    expect(getArray(node2, ['cac:TaxTotal', 'cac:TaxSubtotal'])).toEqual([
      {
        'cbc:TaxableAmount': 1,
      },
      {
        'cbc:TaxableAmount': 2,
      },
    ]);
    expect(getArray({}, ['cac:TaxTotal', 'cac:TaxSubtotal'])).toEqual([]);
  });
});
