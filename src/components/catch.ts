import { traverseChildren } from '../main';
import { Variable } from '../variable';
import { HtmlangElement } from './htmlangElement';

export class CatchDash extends HtmlangElement {
  static getTagName = () => 'catch' as const;

  catchError = (error: any): void => {
    const argName = this.getAttribute('(') ?? '';
    if (argName) {
      this.scope.addVariable(new Variable('let', argName, error, this.scope));
    }

    traverseChildren(this);
  };
}
