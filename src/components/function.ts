import { FunctionEx } from '../functionEx';
import { Variable } from '../variable';
import { CallDash } from './callDash';
import { HtmlangElement } from './htmlangElement';

export class FunctionDash extends HtmlangElement {
  static getTagName = () => 'function' as const;

  private _lastReturnValue: any;

  connectedCallback(): void {
    super.connectedCallback();
    this.style.display = 'none';
  }

  get lastReturnValue(): any {
    return this._lastReturnValue;
  }

  execute = (): void => {
    if (this.attributes.length === 0) {
      throw new Error('Missing function name');
    }

    const funcAttr = this.attributes[0];
    const name = funcAttr.name.endsWith('(') ? funcAttr.name.slice(0, -1) : funcAttr.name;
    const args = funcAttr.value.split(',').map((a) => a.trim());

    const func = new FunctionEx(this, name, args);
    this.parentScope.addFunction(func);
  };

  return = (value: any): void => {
    this._lastReturnValue = value;
  };

  applyResult = (caller: CallDash | null): void => {
    if (!caller) {
      return;
    }

    let innerHtml = this.initialInnerHTML ?? '';
    Variable.forEach(innerHtml, (varName) => {
      const result = this.scope.getVariable(varName);
      innerHtml = innerHtml!.replaceAll(`{${varName}}`, result.value?.value);
    });

    caller.innerHTML = innerHtml;
  };

  cleanup = (): void => {
    this.scope.clear();
  };
}
