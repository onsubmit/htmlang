import { traverseChildren } from '../main';
import { HtmlangElement } from './htmlangElement';

export class FinallyDash extends HtmlangElement {
  static getTagName = () => 'finally' as const;

  continue = (): void => {
    traverseChildren(this);
  };

  rethrow = (error: any): void => {
    traverseChildren(this);
    throw new Error(error);
  };
}
