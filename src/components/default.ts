import { BaseHtmlangElement } from './htmlangElement';

export class DefaultDash extends BaseHtmlangElement {
  static getTagName = () => 'default' as const;

  excludeFromExecution = true;
}
