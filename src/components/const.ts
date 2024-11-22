import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class ConstDash extends BaseHtmlangElement {
  static getTagName = () => 'const';

  execute = () => {
    const parentScope = this._getParentScope();
    for (const attr of this.attributes) {
      if (!attr) continue;

      const variable = new Variable('const', attr.name, attr.value, parentScope);
      parentScope.addVariable(variable);
    }
  };
}
