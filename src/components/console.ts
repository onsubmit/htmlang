import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class ConsoleDash extends BaseHtmlangElement {
  static getTagName = () => 'console' as const;

  execute = (): void => {
    let log = this.getAttribute('log(');
    if (!log) {
      return;
    }

    Variable.forEach(log, (varName) => {
      const result = this.parentScope.getVariable(varName);
      const value = result.found ? result.value.value : undefined;
      log = log!.replaceAll(`{${varName}}`, value);
    });

    console.log(log);
  };
}
