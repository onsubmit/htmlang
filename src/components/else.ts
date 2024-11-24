import { traverseChildren } from '../main';
import { BaseHtmlangElement } from './htmlangElement';

export class ElseDash extends BaseHtmlangElement {
  static getTagName = () => 'else' as const;

  execute = (): void => {
    this.innerHTML = this.initialInnerHTML ?? '';
    traverseChildren(this);
  };

  clear = (): void => {
    this.innerHTML = '';
  };
}
