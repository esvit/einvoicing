/**
 * Helpers
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

import Document from './entity/Document';
import Identifier from './valueObject/Identifier';
import Quantity from './valueObject/Quantity';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type XmlNode = any;

export function nodeToId(node: XmlNode): Identifier {
  if (!node) {
    return undefined;
  }

  if (typeof node === 'number' || typeof node === 'string') {
    return Identifier.create({
      scheme: undefined,
      id: String(node),
    });
  }

  return Identifier.create({
    scheme: node['attr_schemeID'],
    id: node['#text'],
  });
}

/**
 * Converts a node to a quantity object.
 *
 * @param node xml node
 */
export function nodeToQuantity(node: XmlNode): Quantity {
  if (!node) {
    return undefined;
  }

  return Quantity.create({
    value: parseFloat(node['#text']),
    unitCode: node['attr_unitCode'],
  });
}

/**
 * Returns the string value of a node or undefined if the node is null or undefined.
 *
 * @param node xml node
 */
export function strOrUnd(node: XmlNode): string | undefined {
  if (!node && node !== 0) {
    return undefined;
  }
  if (typeof node === 'object') {
    if (typeof node['#text'] === 'undefined') {
      throw new Error('Invalid node');
    }
    return node['#text'].toString();
  }
  return node.toString();
}

/**
 * Returns the number value of a node or undefined if the node is null or undefined.
 *
 * @param node xml node
 */
export function numOrUnd(node: XmlNode): number | undefined {
  return strOrUnd(node) ? parseFloat(strOrUnd(node)) : undefined;
}

/**
 * Returns the array of nodes or an empty array if the node is null or undefined.
 *
 * @param node xml node
 * @param path path of nodes to get the value from
 */
export function getArray(node: XmlNode, path = []) {
  let initNode = node;
  for (const key of path) {
    if (!initNode) {
      return [];
    }
    initNode = initNode[key];
  }
  if (!initNode) {
    return [];
  }
  return Array.isArray(initNode) ? initNode : [initNode];
}

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  useGrouping: false,
});

export function formatNumber(n: number): string {
  if (typeof n === 'undefined') return n;

  return formatter.format(n);
}

const isEmpty = (obj: object): boolean => obj && Object.keys(obj).length === 0;

export function omitEmpty(obj: object): object | undefined {
  const returnObj = {};

  if (!obj) {
    return undefined;
  }

  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      returnObj[key] = value
        .map((v) => omitEmpty(v))
        .filter((v) => typeof v !== 'undefined' && !isEmpty(v));
    } else if (typeof value !== 'undefined') {
      let innerValue;

      if (value !== null && typeof value === 'object') {
        innerValue = omitEmpty(value);
      }

      if (!isEmpty(innerValue)) {
        returnObj[key] = innerValue || value;
      }
    }
  });

  return returnObj;
}

export function omitIf(obj: object, condition: boolean): object {
  if (condition) {
    return undefined;
  }

  return obj;
}

export function computeTotals(document: Document): {
  linesTotalAmount: number;
  taxInclusiveAmount: number;
  taxExclusiveAmount: number;
  chargesTotalAmount: number | undefined;
  taxesTotalAmount: number;
  allowanceTotalAmount: number | undefined;
} {
  const add = (acc: number, value: number) => acc + value;

  const lines = document.lines?.map((line) => line.netAmount || 0);
  const taxes = document.taxes?.map((tax) => tax.taxAmount || 0);

  const charges = document.charges
    ?.filter((charge) => charge.isCharge)
    .map((charge) => charge.amount || 0);

  const allowance = document.charges
    .filter((charge) => !charge.isCharge)
    .map((charge) => charge.amount || 0);

  const linesTotalAmount = lines.reduce(add, 0);
  const chargesTotalAmount = charges.reduce(add, 0);
  const taxesTotalAmount = taxes.reduce(add, 0);
  const allowanceTotalAmount = allowance.reduce(add, 0);

  return {
    taxInclusiveAmount:
      linesTotalAmount + chargesTotalAmount + taxesTotalAmount,
    taxExclusiveAmount: linesTotalAmount + chargesTotalAmount,
    linesTotalAmount,
    taxesTotalAmount,
    chargesTotalAmount: charges.length ? chargesTotalAmount : undefined,
    allowanceTotalAmount: allowance.length ? allowanceTotalAmount : undefined,
  };
}
