import { BaseHtmlangElement } from './htmlangElement';

export class BreakDash extends BaseHtmlangElement {
  static getTagName = () => 'break' as const;
}
