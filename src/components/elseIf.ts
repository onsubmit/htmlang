import { IfDash } from './if';
import { IfDashBase } from './ifBase';

export class ElseIfDash extends IfDashBase {
  static getTagName = () => 'else-if' as const;

  excludeFromExecution = true;

  static observedAttributes = ['('];

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

  clear = (): void => {
    this.innerHTML = '';
    this._nextElse?.clear();
  };
}
