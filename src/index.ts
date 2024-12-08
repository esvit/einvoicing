/**
 * Main entry point for the library, export all necessary classes and functions
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import PeppolRuleset from './ruleset/PeppolRuleset';
import AbstractRuleset from "./ruleset/AbstractRuleset";
import AbstractReader from "./readers/AbstractReader";
import UblReader from "./readers/UblReader";
import { getRuleset } from './rulesets';
import Document from './entity/Document';
import DocumentLine from './entity/DocumentLine';
import Tax from './entity/Tax';
import Address, { IAddress } from './valueObject/Address';
import AllowanceCharge, { IAllowanceCharge } from './valueObject/AllowanceCharge';
import Attachment, { IAttachment } from './valueObject/Attachment';
import Attribute, { IAttribute } from './valueObject/Attribute';
import BinaryObject, { IBinaryObject } from './valueObject/BinaryObject';
import CurrencyCode from './valueObject/CurrencyCode';
import DateOnly from './valueObject/DateOnly';
import Delivery, {IDelivery} from './valueObject/Delivery';
import DocumentType from './valueObject/DocumentType';
import Identifier, {IIdentifier} from './valueObject/Identifier';
import InvoiceReference,{IInvoiceReference} from './valueObject/InvoiceReference';
import Party,{IParty} from './valueObject/Party';
import Payee,{IPayee} from './valueObject/Payee';
import Payment,{IPayment} from './valueObject/Payment';
import PaymentCard,{IPaymentCard} from './valueObject/PaymentCard';
import PaymentMandate,{IPaymentMandate} from './valueObject/PaymentMandate';
import PaymentTransfer,{IPaymentTransfer} from './valueObject/PaymentTransfer';
import { IDocument, DocumentId } from './interface/IDocument';
import { IDocumentLine, DocumentLineId } from './interface/IDocumentLine';
import { ITax, TaxId } from './interface/ITax';

export {
  AbstractRuleset,
  PeppolRuleset,

  AbstractReader,
  UblReader,

  // functions
  getRuleset,

  Document,
  DocumentLine,
  Tax,
  Address,
  AllowanceCharge,
  Attachment,
  Attribute,
  BinaryObject,
  CurrencyCode,
  DateOnly,
  Delivery,
  DocumentType,
  Identifier,
  InvoiceReference,
  Party,
  Payee,
  Payment,
  PaymentCard,
  PaymentMandate,
  PaymentTransfer,

  // interfaces
  IDocument, DocumentId,
  IDocumentLine, DocumentLineId,
  ITax, TaxId,
  IAddress,
  IAllowanceCharge,
  IAttachment,
  IAttribute,
  IBinaryObject,
  IDelivery,
  IIdentifier,
  IInvoiceReference,
  IParty,
  IPayee,
  IPayment,
  IPaymentCard,
  IPaymentMandate,
  IPaymentTransfer,
};
