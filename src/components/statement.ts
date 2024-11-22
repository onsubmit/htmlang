import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

type LineType = 'assignment';

export class StatementDash extends BaseHtmlangElement {
  static getTagName = () => 'statement';

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === '(') {
      if (oldValue !== newValue) {
        this._evaluate(newValue);
      }
    }
  }

  execute = () => {
    const line = this.getAttribute('(') ?? '';
    this._evaluate(line);
  };

  private _evaluate(line: string) {
    switch (this._getLineType(line)) {
      case 'assignment': {
        const [varName, valueStr] = line.split(' = ');
        const result = this.parentScope.getVariable(varName);
        if (result.found) {
          result.variable.set(valueStr);
        } else {
          const variable = new Variable('let', varName, valueStr, this.parentScope);
          this.parentScope.addVariable(variable);
        }
      }
    }
  }

  private _getLineType(line: string): LineType {
    if (line.match(/^\S+ = .+$/)) {
      return 'assignment';
    }

    throw new Error(`Unrecognized line: ${line}`);
  }
}
