import { FunctionEx } from '../functionEx';
import { Variable } from '../variable';
import { CallDash } from './callDash';
import { HtmlangElement } from './htmlangElement';

export class FunctionDash extends HtmlangElement {
  static getTagName = () => 'function' as const;

  connectedCallback(): void {
    super.connectedCallback();
    this.style.display = 'none';
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

  setup = (caller: CallDash): void => {
    let innerHtml = this.initialInnerHTML ?? '';
    Variable.forEach(innerHtml, (varName) => {
      let variable: Variable | undefined;
      const resultFuncScope = this.scope.getVariable(varName);
      if (resultFuncScope.found) {
        variable = resultFuncScope.value;
      } else {
        const resultParentScope = this.parentScope.getVariable(varName);
        if (resultParentScope.found) {
          variable = resultParentScope.value;
        }
      }

      innerHtml = innerHtml!.replaceAll(`{${varName}}`, variable?.value);
    });

    caller.innerHTML = innerHtml;
  };

  teardown = (): void => {
    this.scope.clear();
  };
}
