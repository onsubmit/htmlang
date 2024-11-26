import { HtmlangElement } from './htmlangElement';

export class BreakDash extends HtmlangElement {
  static getTagName = () => 'break' as const;

  execute = (): void => {};
}
