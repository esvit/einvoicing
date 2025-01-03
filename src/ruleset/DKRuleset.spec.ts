import Document from '../entity/Document';
import Party from '../valueObject/Party';
import { DocumentId, DocumentTypes } from '../interface/IDocument';
import DKRuleset from './DKRuleset';

describe('DKRuleset', () => {
  test('validate', () => {
    const ruleset = new DKRuleset();
    const doc = Document.create(DocumentTypes.Invoice, ruleset, {
      id: new DocumentId('1'),
      seller: Party.create({ companyId: undefined }),
    });
    expect(doc.validate()).toEqual({
      errors: [
        {
          key: 'DK-R-002',
          message: 'Danish suppliers MUST provide legal entity (CVR-number)',
        },
      ],
      warning: [],
    });
  });
});
