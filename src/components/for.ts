import { HtmlangElement } from './htmlangElement';

export class ForDash extends HtmlangElement {
  static observedAttributes = ['('];

  _innerHtml: string | null = null;

  connectedCallback() {
    super.connectedCallback();

    this._innerHtml = this.innerHTML;
    this._loop(this.getAttribute('(') ?? '');
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this._innerHtml === null) {
      return;
    }

    if (name === '(') {
      if (oldValue !== newValue) {
        this._loop(newValue);
      }
    }
  }

  _loop(value: string) {
    this.innerHTML = '';
    const [varName, arr] = value.split(' of ');
    for (const item of eval(arr)) {
      this.innerHTML += this._innerHtml!.replaceAll(`{${varName}}`, item);
    }
  }
}
