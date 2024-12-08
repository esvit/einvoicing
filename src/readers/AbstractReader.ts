/**
 * Abstract Reader
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { promises as fs } from 'fs';
import Document from "../entity/Document";

export default
abstract class AbstractReader  {
  abstract read(content: string): Promise<Document>;

  async readFromFile(filename: string): Promise<Document> {
    const content = await fs.readFile(filename, 'utf-8');
    return this.read(content);
  }
}
