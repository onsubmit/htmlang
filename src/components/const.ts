import { Variable } from '../variable';
import { HtmlangElement } from './htmlangElement';

export class ConstDash extends HtmlangElement {
  connectedCallback() {
    super.connectedCallback();

    const attr = this.attributes[0];
    if (!attr) return;

    const parentScope = this._getParentScope();
    const variable = new Variable(attr.name, attr.value, parentScope);
    parentScope.addVariable(variable);
  }
}
