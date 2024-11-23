import { traverseDomTree } from '../main';
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
      const a = !!eval(oldValue);
      const b = !!eval(newValue);
      if (a !== b) {
        this._setCondition(b);
        traverseDomTree(this);
      }
    }
  }

  execute = (): void => {
    let condition = this.getAttribute('(');
    if (!condition) {
      throw new Error('No condition found');
    }

    Variable.forEach(condition, (varName) => {
      const result = this.parentScope.getVariable(varName);
      const value = result.found ? result.variable.value : undefined;
      condition = condition!.replaceAll(`{${varName}}`, value);
    });

    const evaluated = !!eval(condition);
    console.debug(`"${condition}" evaluated to ${evaluated}`);
    this._setCondition(evaluated);
  };

  _setCondition = (value: boolean): void => {
    if (value) {
      this.innerHTML = this._innerHtml ?? '';
      this._nextElse?.clear();
    } else {
      this.innerHTML = '';
      this._nextElse?.execute();
    }
  };
}
