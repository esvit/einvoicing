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

export class DocumentLineId extends EntityId<string> {
  readonly DocumentLineId = 'document_line_id';
}

export interface IDocumentLine {
  id: DocumentLineId;
  note?: string;
  quantity?: number;
  unitCode?: string;
  buyerAccountingReference?: string;
  orderLineReference?: string;
  periodStart?: DateOnly;
  periodEnd?: DateOnly;
  name?: string;
  description?: string;
  buyerIdentifier?: string;
  sellerIdentifier?: string;
  standardIdentifier?: string;
  originCountryCode?: string;
  classificationIdentifiers?: Identifier[];
  price?: number;
  netAmount?: number;
  baseQuantity?: number;
  attributes?: Attribute[];
  charges?: AllowanceCharge[];
  tax?: Tax;
}
