/**
 * PaymentTransfer.ts
 *
 * @copyright Vitalii Savchuk <esvit666@gmail.com>
 * @package einvoicing
 * @licence MIT https://opensource.org/licenses/MIT
 */
import {ValueObject} from "../base/ValueObject";

export interface IPaymentTransfer {
  // BT-84: Receiving account ID
  account?: string;

  // BT-85: Receiving account name
  name?: string;

  // BT-86: Service provider ID
  provider?: string;
}

export default
class PaymentTransfer extends ValueObject<IPaymentTransfer> {
  public static create(props: IPaymentTransfer): PaymentTransfer {
    return new PaymentTransfer(props);
  }

  toPrimitive() {
    return this.props;
  }
}
