import { HtmlangElement } from './htmlangElement';

export class IfDash extends HtmlangElement {
  static observedAttributes = ['('];

  _innerHtml: string | null = null;

  connectedCallback() {
    super.connectedCallback();

    this._innerHtml = this.innerHTML;

    const condition = this.getAttribute('(');
    this._setCondition(!!eval(condition ?? ''));
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this._innerHtml === null) {
      return;
    }

    if (name === '(') {
      const a = !!eval(oldValue);
      const b = !!eval(newValue);
      if (a !== b) {
        this._setCondition(b);
      }
    }
  }

  _setCondition(value: boolean) {
    this.innerHTML = (value && this._innerHtml) || '';
  }
}
