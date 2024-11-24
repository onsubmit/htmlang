import { traverseChildren } from '../main';
import { Variable } from '../variable';
import { ElseDash } from './else';
import { BaseHtmlangElement } from './htmlangElement';
import { IfDash } from './if';

export class ElseIfDash extends BaseHtmlangElement {
  static getTagName = () => 'else-if' as const;

  static observedAttributes = ['('];

  private _nextElse: ElseDash | ElseIfDash | null = null;

  connectedCallback(): void {
    super.connectedCallback();

    if (
      this.nextElementSibling instanceof ElseIfDash ||
      this.nextElementSibling instanceof ElseDash
    ) {
      this._nextElse = this.nextElementSibling;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (this.initialInnerHTML === null) {
      return;
    }

    if (name === '(') {
      const a = this._evaluate(oldValue);
      const b = this._evaluate(newValue);
      if (a !== b) {
        // Traverse and find the top <if-> statement, and re-execute it.
        let current: Element | null = this.previousElementSibling;
        while (current !== null && !(current instanceof IfDash)) {
          current = current.previousElementSibling;
        }

        current?.execute();
      }
    }
  }

  execute = (): void => {
    const evaluated = this._evaluate(this.getAttribute('('));
    this._setCondition(evaluated);
  };

  clear = (): void => {
    this.innerHTML = '';
    this._nextElse?.clear();
  };

  private _evaluate(value: string | null): boolean {
    let condition = value;
    if (!condition) {
      throw new Error('No condition found');
    }

    Variable.forEach(condition, (varName) => {
      const result = this.parentScope.getVariable(varName);
      const value = result.found ? result.variable.value : undefined;
      condition = condition!.replaceAll(`{${varName}}`, value);
    });

    const evaluated = !!eval(condition);
    if (value === condition) {
      console.debug(`"${condition}" -> ${evaluated}`);
    } else {
      console.debug(`"${value} -> "${condition}" -> ${evaluated}`);
    }

    return evaluated;
  }

  _setCondition = (value: boolean): void => {
    if (value) {
      this.innerHTML = this.initialInnerHTML ?? '';
      this._nextElse?.clear();
      traverseChildren(this);
    } else {
      this.innerHTML = '';

      this._nextElse?.execute();
    }
  };
}
