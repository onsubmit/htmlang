import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class IfDash extends BaseHtmlangElement {
  static getTagName = () => 'if' as const;

  static observedAttributes = ['('];

  _innerHtml: string | null = null;

  connectedCallback(): void {
    this._innerHtml = this.innerHTML;
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
    this._setCondition(!evaluated);
  };

  _setCondition = (value: boolean): void => {
    this.innerHTML = (value && this._innerHtml) || '';
  };
}
