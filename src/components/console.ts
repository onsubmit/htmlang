import { Variable } from '../variable';
import { HtmlangElement } from './htmlangElement';

export class ConsoleDash extends HtmlangElement {
  connectedCallback() {
    super.connectedCallback();

    let log = this.getAttribute('log(');
    if (!log) {
      return;
    }

    Variable.forEach(log, (varName) => {
      const result = this.parentScope.getVariable(varName);
      const value = result.found ? result.variable.value : undefined;
      log = log!.replaceAll(`{${varName}}`, value);
    });

    console.log(log);
  }
}
