import { BaseHtmlangElement } from './htmlangElement';

export class DefaultDash extends BaseHtmlangElement {
  static getTagName = () => 'default' as const;

  excludeFromElementGraph = true;

  /* istanbul ignore next */
  execute = (): void => {
    throw new Error('Method not implemented.');
  };
}
