import InvoiceUBLRuleset from "./InvoiceUBLRuleset";
import Document from "../entity/Document";
import {DocumentId, DocumentTypes} from "../interface/IDocument";
import DateOnly from "../valueObject/DateOnly";
import DocumentType from "../valueObject/DocumentType";

describe('InvoiceUBLRuleset', () => {
  test('success validation', async () => {
    const ruleset = new InvoiceUBLRuleset();

    const document = Document.create(DocumentTypes.Invoice, ruleset, <any>{
      id: new DocumentId('12345'),
      issueDate: DateOnly.create('2019-01-25'),
      dueDate: DateOnly.create('2019-02-24'),
      type: DocumentType.create('123'),
      lines: []
    });
    const errors = await document.validate();
    expect(errors).toEqual({
      "errors": [
        {
          "key": "BR-CL-01",
          "message": "[BR-CL-01]-The document type code MUST be coded by the invoice and credit note related code lists of UNTDID 1001."
        },
        {
          "key": "BR-CL-03",
          "message": "[BR-CL-03]-currencyID MUST be coded using ISO code list 4217 alpha-3"
        },
        {
          "key": "BR-CL-03",
          "message": "[BR-CL-03]-currencyID MUST be coded using ISO code list 4217 alpha-3"
        },
        {
          "key": "BR-CL-03",
          "message": "[BR-CL-03]-currencyID MUST be coded using ISO code list 4217 alpha-3"
        },
        {
          "key": "BR-CL-03",
          "message": "[BR-CL-03]-currencyID MUST be coded using ISO code list 4217 alpha-3"
        }
      ],
      "warnings": []
    });
  });
});
