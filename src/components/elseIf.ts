import { Variable } from '../variable';
import { ElseDash } from './else';
import { BaseHtmlangElement } from './htmlangElement';

export class ElseIfDash extends BaseHtmlangElement {
  static getTagName = () => 'else-if' as const;

  static observedAttributes = ['('];

  private _innerHtml: string | null = null;
  private _nextElse: ElseDash | ElseIfDash | null = null;

  connectedCallback(): void {
    this._innerHtml = this.innerHTML;
    this.clear();

    if (
      this.nextElementSibling instanceof ElseIfDash ||
      this.nextElementSibling instanceof ElseDash
    ) {
      this._nextElse = this.nextElementSibling;
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

  clear = (): void => {
    this.innerHTML = '';
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
