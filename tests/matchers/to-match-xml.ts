import { expect } from '@jest/globals';
import { diff } from 'jest-diff';

import { XMLParser } from 'fast-xml-parser';

const parseXML = (content) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: true,
    trimValues: true,
  });

  return parser.parse(content);
};

function isSubset(
  subset: Record<string, unknown>,
  superset: Record<string, unknown>,
): boolean {
  // Leverage the existing toMatchObject() behaviour to do the deep matching
  try {
    expect(superset).toMatchObject(subset);
    return true;
  } catch {
    return false;
  }
}

expect.extend({
  toMatchXML(actual: string, expected: string) {
    const actualXML = parseXML(actual);
    const expectedXML = parseXML(expected);

    const pass = isSubset(expectedXML, actualXML);

    if (pass) {
      return {
        pass: true,
        message: () =>
          `expect(actual).toMatchXML(expected):\n\n${diff(actualXML, expectedXML)}`,
      };
    }

    return {
      pass: false,
      message: () =>
        `expect(actual).toMatchXML(expected):\n\n${diff(actualXML, expectedXML)}`,
      actual: actualXML,
      expected: expectedXML,
    };
  },
});
