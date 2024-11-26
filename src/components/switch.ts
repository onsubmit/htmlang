import { traverseChildren } from '../main';
import { Variable } from '../variable';
import { CaseDash } from './case';
import { DefaultDash } from './default';
import { HtmlangElement } from './htmlangElement';

export class SwitchDash extends HtmlangElement {
  static getTagName = () => 'switch' as const;

  private _defaultCase: DefaultDash | undefined;

  private get _cases(): Array<CaseDash> {
    const list: Array<CaseDash> = [];
    let numDefaultCases = 0;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child instanceof CaseDash) {
        if (numDefaultCases > 0) {
          throw new Error('default case must be the last case');
        }
        list.push(child);
      } else if (child instanceof DefaultDash) {
        if (++numDefaultCases > 1) {
          throw new Error('switch statement cannot have more than one default case');
        }

        this._defaultCase = child;
      }
    }

    return list;
  }

  execute = (): void => {
    const evaluated = this._evaluate(this.getAttribute('('));
    let earlierCaseWithoutBreakMatched = false;

    for (const caseStatement of this._cases) {
      const caseMatched = caseStatement.matchesCondition(evaluated, this.parentScope);
      if (caseMatched || earlierCaseWithoutBreakMatched) {
        traverseChildren(caseStatement);
        if (caseStatement.hasBreakStatement) {
          return;
        } else {
          earlierCaseWithoutBreakMatched = true;
        }
      }
    }

    if (this._defaultCase) {
      traverseChildren(this._defaultCase);
    }
  };

  private _evaluate = (value: string | null): any => {
    if (!value) {
      throw new Error('No condition found');
    }

    const condition = Variable.expandAll(value, this.parentScope);
    const evaluated = eval(condition);
    return evaluated;
  };
}
