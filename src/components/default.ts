import { BaseHtmlangElement } from './htmlangElement';

export class DefaultDash extends BaseHtmlangElement {
  static getTagName = () => 'default' as const;

  /* istanbul ignore next */
  execute = (): void => {
    throw new Error('Method not implemented.');
  };
}
