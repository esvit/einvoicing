/**
 * Helpers
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */

/**
 * Returns the string value of a node or undefined if the node is null or undefined.
 *
 * @param node xml node
 */
export
function strOrUnd(node: any):string|undefined {
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
export
function numOrUnd(node: any):number|undefined {
  return strOrUnd(node) ? parseFloat(strOrUnd(node)) : undefined;
}

/**
 * Returns the array of nodes or an empty array if the node is null or undefined.
 *
 * @param node xml node
 * @param path path of nodes to get the value from
 */
export
function getArray(node:any, path = []) {
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
