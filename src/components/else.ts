import { ElseIfDash } from './elseIf';
import { BaseHtmlangElement } from './htmlangElement';
import { IfDash } from './if';

export class ElseDash extends BaseHtmlangElement {
  static getTagName = () => 'else' as const;

  private _innerHtml: string | null = null;

  connectedCallback(): void {
    this._innerHtml = this.innerHTML;
  }

  execute = (): void => {
    if (
      !(this.previousElementSibling instanceof IfDash) &&
      !(this.previousElementSibling instanceof ElseIfDash)
    ) {
      throw new Error('Corresponding <if-> or <else-if-> element not found');
    }

    this.innerHTML = this._innerHtml ?? '';
  };

  clear = (): void => {
    this.innerHTML = '';
  };
}
