import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class AlertDash extends BaseHtmlangElement {
  static getTagName = () => 'alert' as const;

  execute = (): void => {
    let alertVal = this.getAttribute('alert(');
    if (!alertVal) {
      return;
    }

    Variable.forEach(alertVal, (varName) => {
      const result = this.parentScope.getVariable(varName);
      const value = result.found ? result.variable.value : undefined;
      alertVal = alertVal!.replaceAll(`{${varName}}`, value);
    });

    alert(alertVal);
  };
}
