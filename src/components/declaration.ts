import { Variable, VariableType } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class Declaration extends BaseHtmlangElement {
  private _type: VariableType;
  private _variables: Array<Variable> = [];

  constructor(type: VariableType) {
    super();
    this._type = type;
  }

  disconnectedCallback(): void {
    let variable: Variable | undefined;
    while ((variable = this._variables.pop())) {
      this.parentScope.removeVariable(variable);
    }
  }

  execute = () => {
    const parentScope = this._getParentScope();
    for (const attr of this.attributes) {
      if (!attr) continue;

      const variable = new Variable(this._type, attr.name, attr.value, parentScope);
      this._variables.push(variable);
      parentScope.addVariable(variable);
    }
  };
}
