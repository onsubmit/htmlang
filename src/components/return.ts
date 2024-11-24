import { Variable } from '../variable';
import { FunctionDash } from './function';
import { HtmlangElement } from './htmlangElement';

export class ReturnDash extends HtmlangElement {
  static getTagName = () => 'return' as const;

  execute = (): void => {
    const functionElement = this._getFunctionElement();

    let innerHtml = this.initialInnerHTML ?? '';
    Variable.forEach(innerHtml, (varName) => {
      const result = this.scope.getVariable(varName);
      innerHtml = innerHtml!.replaceAll(`{${varName}}`, result.value?.value);
    });

    const value = eval(innerHtml);
    functionElement.return(value);
  };

  private _getFunctionElement = (): FunctionDash => {
    let parent = this.parentElement;
    while (parent !== null) {
      if (parent instanceof FunctionDash) {
        return parent;
      } else {
        parent = parent.parentElement;
      }
    }

    throw new Error('Return statement has no corresponding function.');
  };
}
