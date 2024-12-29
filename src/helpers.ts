/**
 * Helpers
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

import Identifier from './valueObject/Identifier';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type XmlNode = any;

export function nodeToId(node: XmlNode): Identifier {
  if (!node) {
    return undefined;
  }

  return Identifier.create({
    scheme: node['attr_schemeID'],
    id: node['#text'],
  });
}

/**
 * Returns the string value of a node or undefined if the node is null or undefined.
 *
 * @param node xml node
 */
export function strOrUnd(node: XmlNode): string | undefined {
  if (!node) {
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
  return formatter.format(n);
}
