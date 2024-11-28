import { traverseChildren } from '../main';
import { BaseHtmlangElement } from './htmlangElement';

export class ElseDash extends BaseHtmlangElement {
  static getTagName = () => 'else' as const;

  excludeFromElementGraph = true;

  execute = (): void => {
    this.innerHTML = this.initialInnerHTML ?? '';
    traverseChildren(this);
  };

  clear = (): void => {
    this.innerHTML = '';
  };
}
