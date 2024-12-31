import { formatNumber, getArray, numOrUnd, strOrUnd } from './helpers';

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

  describe('formatNumber', () => {
    it('does not add decimals to integers', () => {
      expect(formatNumber(-100)).toBe('-100');
      expect(formatNumber(1)).toBe('1');
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(5000)).toBe('5000');
    });

    it('returns a number with decimals when necessary', () => {
      expect(formatNumber(5000.5)).toBe('5000.5');
      expect(formatNumber(5000.556)).toBe('5000.56');
    });
  });
});
