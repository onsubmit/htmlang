import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class LetDash extends BaseHtmlangElement {
  static getTagName = () => 'let';

  execute = () => {
    const attr = this.attributes[0];
    if (!attr) return;

    const parentScope = this._getParentScope();
    const variable = new Variable('let', attr.name, attr.value, parentScope);
    parentScope.addVariable(variable);
  };
}
