/**
 * AbstractWriter.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import Document from "../entity/Document";

export default
abstract class AbstractWriter {
  abstract write(document: Document): string;
}
