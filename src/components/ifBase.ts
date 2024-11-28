import { traverseChildren } from '../main';
import { Variable } from '../variable';
import { ElseDash } from './else';
import { ElseIfDash } from './elseIf';
import { BaseHtmlangElement } from './htmlangElement';

export abstract class IfDashBase extends BaseHtmlangElement {
  protected get _nextElse(): ElseDash | ElseIfDash | undefined {
    if (
      this.nextElementSibling instanceof ElseIfDash ||
      this.nextElementSibling instanceof ElseDash
    ) {
      return this.nextElementSibling;
    }
  }

  execute = (): void => {
    const evaluated = this._evaluate(this.getAttribute('('));
    if (evaluated) {
      this.innerHTML = Variable.expandAll(this.initialInnerHTML, this.parentScope);
      this._nextElse?.clear();
      traverseChildren(this);
    } else {
      this.innerHTML = '';
      this._nextElse?.execute();
    }
  };

  protected _evaluate(value: string | null): boolean {
    if (!value) {
      throw new Error('No condition found');
    }

    const condition = Variable.expandAll(value, this.parentScope);
    const evaluated = !!eval(condition);
    if (value === condition) {
      console.debug(`"${condition}" -> ${evaluated}`);
    } else {
      console.debug(`"${value} -> "${condition}" -> ${evaluated}`);
    }

    return evaluated;
  }
}
