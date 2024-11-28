import { IfDashBase } from './ifBase';

export class IfDash extends IfDashBase {
  static getTagName = () => 'if' as const;

  static observedAttributes = ['('];

  executesOwnChildren = true;

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (this.initialInnerHTML === null) {
      return;
    }

    if (name === '(') {
      const a = this._evaluate(oldValue);
      const b = this._evaluate(newValue);
      if (a !== b) {
        this.execute();
      }
    }
  }
}
