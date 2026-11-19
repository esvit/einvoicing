/**
 * UnsupportedDocumentError.ts
 *
 * Thrown when the XML is well-formed but is not a document this library
 * reads: the root element is not a UBL 2.x Invoice/CreditNote, by name or by
 * namespace. Typed so callers can tell "wrong dialect" apart from broken XML.
 */
export default class UnsupportedDocumentError extends Error {
  constructor(message: string) {
    super(message);
    // The es5 build target breaks the prototype chain of subclassed built-ins;
    // restoring it keeps `instanceof` working (same as HashError).
    Object.setPrototypeOf(this, UnsupportedDocumentError.prototype);
  }
}
