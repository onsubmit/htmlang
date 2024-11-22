import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class LetDash extends BaseHtmlangElement {
  static getTagName = () => 'let';

  execute = () => {
    const parentScope = this._getParentScope();
    for (const attr of this.attributes) {
      if (!attr) continue;

      const variable = new Variable('let', attr.name, attr.value, parentScope);
      parentScope.addVariable(variable);
    }
  };
}
