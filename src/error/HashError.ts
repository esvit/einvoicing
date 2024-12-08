/**
 * HashError.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
export
class HashError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, HashError.prototype);
  }
}
