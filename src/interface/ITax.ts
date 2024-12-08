/**
 * ITax.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package esvit/einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import CurrencyCode from "../valueObject/CurrencyCode";
import {EntityId} from "../base/EntityId";

export class TaxId extends EntityId<string> {
  readonly TaxId = 'tax_id';

  constructor(id: string, percent: number) {
    super(`${id}:${percent ?? 0}`);
  }
}

export interface ITax {
  id: TaxId;
  currency?: CurrencyCode;
  taxableAmount?: number;
  taxAmount?: number;
  percent?: number;
  taxExemptionReason?: string;
  taxExemptionReasonCode?: string;
}
