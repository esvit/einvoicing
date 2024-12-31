import fs from 'node:fs';
import path from 'node:path';

import UblReader from './readers/UblReader';
import UblWriter from './writers/UblWriter';

const fixtureFiles = ['peppol-base.xml'];

const readFixture = async (filename: string) => {
  const content = await fs.promises.readFile(
    path.join(__dirname, '../tests/files', filename),
    'utf8',
  );

  return content;
};

describe('einvoicing', () => {
  describe.each(fixtureFiles)(
    'when round trip serialization of %s',
    (filename) => {
      it('returns the same XML', async () => {
        const original = await readFixture(filename);

        const ublReader = new UblReader();
        const document = await ublReader.read(original);

        const ublWriter = new UblWriter();
        const output = await ublWriter.write(document);

        expect(original).toMatchXML(output);
      });
    },
  );
});
