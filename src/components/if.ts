import { traverseChildren } from '../main';
import { Variable } from '../variable';
import { ElseDash } from './else';
import { ElseIfDash } from './elseIf';
import { BaseHtmlangElement } from './htmlangElement';

export class IfDash extends BaseHtmlangElement {
  static getTagName = () => 'if' as const;

  static observedAttributes = ['('];

  private _innerHtml: string | null = null;
  private _nextElse: ElseDash | ElseIfDash | null = null;

  connectedCallback(): void {
    this._innerHtml = this.innerHTML;

    if (
      this.nextElementSibling instanceof ElseIfDash ||
      this.nextElementSibling instanceof ElseDash
    ) {
      this._nextElse = this.nextElementSibling;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (this._innerHtml === null) {
      return;
    }

    if (name === '(') {
      const a = this._evaluate(oldValue);
      const b = this._evaluate(newValue);
      if (a !== b) {
        this.execute();
      }
    }
  }

  execute = (): void => {
    const evaluated = this._evaluate(this.getAttribute('('));
    this._setCondition(evaluated);
  };

  private _evaluate(value: string | null): boolean {
    let condition = value;
    if (!condition) {
      throw new Error('No condition found');
    }

    Variable.forEach(condition, (varName) => {
      const result = this.parentScope.getVariable(varName);
      const value = result.found ? result.variable.value : undefined;
      condition = condition!.replaceAll(`{${varName}}`, value);
    });

    const evaluated = !!eval(condition);
    if (value === condition) {
      console.debug(`"${condition}" -> ${evaluated}`);
    } else {
      console.debug(`"${value} -> "${condition}" -> ${evaluated}`);
    }

    return evaluated;
  }

  _setCondition = (value: boolean): void => {
    if (value) {
      this.innerHTML = this._innerHtml ?? '';
      this._nextElse?.clear();
      traverseChildren(this);
    } else {
      this.innerHTML = '';
      this._nextElse?.execute();
    }
  };
}
