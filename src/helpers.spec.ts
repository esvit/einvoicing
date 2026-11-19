import {
  childByLocalName,
  formatNumber,
  getArray,
  numOrUnd,
  omitEmpty,
  strOrUnd,
} from './helpers';

describe('helpers', () => {
  test('strOrUnd', () => {
    expect(strOrUnd(null)).toBe(undefined);
    expect(strOrUnd(undefined)).toBe(undefined);
    expect(strOrUnd({ '#text': 'test' })).toBe('test');
    // An element with attributes but no content parses to an object
    // without '#text'; it should read as absent.
    expect(strOrUnd({})).toBe(undefined);
    expect(strOrUnd({ attr_languageID: 'da' })).toBe(undefined);
    // Repeated elements parse to an array; the first occurrence wins.
    expect(strOrUnd([{ '#text': 'first' }, { '#text': 'second' }])).toBe(
      'first',
    );
    expect(strOrUnd(['first', 'second'])).toBe('first');
    expect(strOrUnd([])).toBe(undefined);
  });

  test('numOrUnd', () => {
    expect(numOrUnd(null)).toBe(undefined);
    expect(numOrUnd(undefined)).toBe(undefined);
    expect(numOrUnd({ '#text': '1' })).toBe(1);
    expect(numOrUnd({})).toBe(undefined);
  });

  test('childByLocalName', () => {
    expect(childByLocalName(undefined, 'ID')).toBe(undefined);
    expect(childByLocalName('text', 'ID')).toBe(undefined);
    expect(childByLocalName({ 'cbc:ID': '1' }, 'ID')).toBe('1');
    expect(childByLocalName({ 'ns2:ID': '1' }, 'ID')).toBe('1');
    expect(childByLocalName({ ID: '1' }, 'ID')).toBe('1');
    expect(childByLocalName({ 'cbc:UUID': '1' }, 'ID')).toBe(undefined);
    expect(childByLocalName({ 'attr_xmlns:ID': 'urn:x' }, 'ID')).toBe(
      undefined,
    );
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

  describe('omitEmpty', () => {
    it('removes deeply nested empty objects', () => {
      expect(
        omitEmpty({
          a: { b: { c: undefined } },
          d: { e: { f: { h: 2, i: undefined } } },
          j: [undefined, { k: 2 }, { l: undefined }],
        }),
      ).toEqual({
        d: { e: { f: { h: 2 } } },
        j: [{ k: 2 }],
      });
    });
  });
});
