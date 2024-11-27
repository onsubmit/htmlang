import { BaseHtmlangElement } from './htmlangElement';

export class ScopeDash extends BaseHtmlangElement {
  static getTagName = () => 'scope' as const;
}
