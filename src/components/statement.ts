import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

type LineType = 'assignment';

export class StatementDash extends BaseHtmlangElement {
  static getTagName = () => 'statement' as const;
  static observedAttributes = ['('];

  private _evaluated = false;
  private _variables: Array<Variable> = [];

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (!this._evaluated) {
      return;
    }

    if (name === '(') {
      if (oldValue !== newValue) {
        this._evaluate(newValue);
      }
    }
  }

  disconnectedCallback(): void {
    let variable: Variable | undefined;
    while ((variable = this._variables.pop())) {
      this.parentScope.removeVariable(variable);
    }

    super.disconnectedCallback();
  }

  execute = (): void => {
    const line = this.getAttribute('(') ?? '';
    this._evaluate(line);
  };

  private _evaluate = (line: string): void => {
    this._evaluated = true;

    switch (this._getLineType(line)) {
      case 'assignment': {
        const [varName, valueStr] = line.split(' = ');
        const result = this.parentScope.getVariable(varName);
        if (result.found) {
          result.value.set(valueStr);
        } else {
          const variable = new Variable('let', varName, valueStr, this.parentScope);
          this.parentScope.addVariable(variable);
          this._variables.push(variable);
        }
      }
    }
  };

  private _getLineType(line: string): LineType {
    if (line.match(/^\S+ = .+$/)) {
      return 'assignment';
    }

    throw new Error(`Unrecognized line: ${line}`);
  }
}
