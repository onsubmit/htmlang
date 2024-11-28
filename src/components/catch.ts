import { traverseChildren } from '../main';
import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class CatchDash extends BaseHtmlangElement {
  static getTagName = () => 'catch' as const;

  excludeFromElementGraph = true;

  catchError = (error: any): void => {
    const argName = this.getAttribute('(') ?? '';
    if (argName) {
      this.scope.addVariable(new Variable('let', argName, error, this.scope));
    }

    traverseChildren(this);
  };
}
