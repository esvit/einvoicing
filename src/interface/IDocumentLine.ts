/**
 * IDocumentLine.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import { EntityId } from '../base/EntityId';
import DateOnly from '../valueObject/DateOnly';
import Identifier from '../valueObject/Identifier';
import Attribute from '../valueObject/Attribute';
import AllowanceCharge from '../valueObject/AllowanceCharge';
import Tax from '../entity/Tax';
import ListIdentifier from '../valueObject/ListIdentifier';
import Quantity from '../valueObject/Quantity';

export class DocumentLineId extends EntityId<string> {
  readonly DocumentLineId = 'document_line_id';
}

export interface IDocumentLine {
  id: DocumentLineId;
  note?: string;
  quantity?: number;
  unitCode?: string;
  buyerAccountingReference?: string;
  orderLineReference?: Identifier;
  periodStart?: DateOnly;
  periodEnd?: DateOnly;
  name?: string;
  description?: string;
  buyerIdentifier?: string;
  sellerIdentifier?: Identifier;
  standardIdentifier?: Identifier;
  originCountryCode?: string;
  classificationIdentifiers?: Identifier[] | ListIdentifier[];
  price?: number;
  netAmount?: number;
  baseQuantity?: Quantity;
  attributes?: Attribute[];
  charges?: AllowanceCharge[];
  tax?: Tax;
}
