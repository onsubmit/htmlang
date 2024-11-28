import { ElementGraph } from '../elementGraph';
import { BaseHtmlangElement } from './htmlangElement';

export class ElseDash extends BaseHtmlangElement {
  static getTagName = () => 'else' as const;

  excludeFromExecution = true;

  execute = (): void => {
    this.innerHTML = this.initialInnerHTML ?? '';
    ElementGraph.traverseChildren(this);
  };

  clear = (): void => {
    this.innerHTML = '';
  };
}
