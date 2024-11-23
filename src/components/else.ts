import { BaseHtmlangElement } from './htmlangElement';

export class ElseDash extends BaseHtmlangElement {
  static getTagName = () => 'else' as const;

  private _innerHtml: string | null = null;

  connectedCallback(): void {
    this._innerHtml = this.innerHTML;
    this.clear();
  }

  execute = (): void => {
    this.innerHTML = this._innerHtml ?? '';
  };

  clear = (): void => {
    this.innerHTML = '';
  };
}
