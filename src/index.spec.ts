import fs from 'node:fs';
import path from 'node:path';

import UblReader from './readers/UblReader';
import UblWriter from './writers/UblWriter';

const fixtureFiles = [
  'bis3_invoice_negativ.xml',
  'bis3_invoice_positive.xml',
  'peppol-allowance.xml',
  'peppol-base.xml',
  'peppol-vat-o.xml',
  'peppol-vat-s.xml',

  // TODO: Fix these tests
  // 'ft_g2g_td01_con_allegato_bonifico_e_split_payment.xml',
  // 'guide-example1.xml',
  // 'guide-example2.xml',
  // 'guide-example3.xml',
  // 'peppol-credit-note.xml',
  // 'peppol-rounding.xml',
  // 'ubl-invoice-2.0-example.xml',
  // 'ubl-invoice-2.1-example-trivial.xml',
  // 'ubl-invoice-2.1-example.xml',
];

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
