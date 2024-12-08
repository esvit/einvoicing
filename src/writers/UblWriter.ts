/**
 * UblWriter.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import AbstractWriter from "./AbstractWriter";
import Document from "../entity/Document";

export default
class UblWriter extends AbstractWriter {
  write(document: Document): string {
    // Implement the method to write UBL eInvoicing documents
    // This is a placeholder implementation
    return JSON.stringify(document.toPrimitive());
  }
}
