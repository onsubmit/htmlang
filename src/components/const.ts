import { HtmlangElement } from './htmlangElement';

export class ConstDash extends HtmlangElement {
  connectedCallback() {
    super.connectedCallback();

    const attr = this.attributes[0];
    if (!attr) return;

    const parentScope = this._getParentScope();
    parentScope.addVariable(attr.name, attr.value);
  }
}
