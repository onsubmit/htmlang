import { Scope } from '../scope';
import { Variable } from '../variable';
import { BreakDash } from './break';
import { BaseHtmlangElement } from './htmlangElement';

export class CaseDash extends BaseHtmlangElement {
  static getTagName = () => 'case' as const;

  excludeFromExecution = true;

  get hasBreakStatement(): boolean {
    for (const child of this.children) {
      if (child instanceof BreakDash) {
        return true;
      }
    }

    return false;
  }

  matchesCondition = (condition: any, scope: Scope): boolean => {
    const evaluated = this._evaluate(this.getAttribute('('), scope);
    return condition === evaluated;
  };

  private _evaluate = (value: string | null, scope: Scope): any => {
    if (!value) {
      throw new Error('No condition found');
    }

    const condition = Variable.expandAll(value, scope);
    const evaluated = eval(condition);
    return evaluated;
  };
}
