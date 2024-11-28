import { ElementGraph } from '../elementGraph';
import { BaseHtmlangElement } from './htmlangElement';

export class FinallyDash extends BaseHtmlangElement {
  static getTagName = () => 'finally' as const;

  excludeFromExecution = true;

  continue = (): void => {
    ElementGraph.traverseChildren(this);
  };

  rethrow = (error: any): void => {
    ElementGraph.traverseChildren(this);
    throw new Error(error);
  };
}
