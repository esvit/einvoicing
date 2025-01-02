/**
 * AbstractWriter.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { promises as fs } from 'fs';
import Document from '../entity/Document';

export default abstract class AbstractWriter {
  abstract write(document: Document): string;

  writeToFile(document: Document, filename: string): Promise<void> {
    return fs.writeFile(filename, this.write(document));
  }
}
