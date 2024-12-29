import Identifier, { IIdentifier } from './Identifier';

export default class ListIdentifier extends Identifier {
  public static create(props: IIdentifier): ListIdentifier {
    return new ListIdentifier(props);
  }

  toPrimitive() {
    const value = {
      '#text': this.id,
    };

    if (this.scheme) {
      value['attr_listID'] = String(this.scheme);
    }

    return value;
  }
}
