import { traverseChildren } from '../main';
import { BaseHtmlangElement } from './htmlangElement';

export class FinallyDash extends BaseHtmlangElement {
  static getTagName = () => 'finally' as const;

  excludeFromElementGraph = true;

  continue = (): void => {
    traverseChildren(this);
  };

  rethrow = (error: any): void => {
    traverseChildren(this);
    throw new Error(error);
  };
}
