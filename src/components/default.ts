import { HtmlangElement } from './htmlangElement';

export class DefaultDash extends HtmlangElement {
  static getTagName = () => 'default' as const;

  /* istanbul ignore next */
  execute = (): void => {
    throw new Error('Method not implemented.');
  };
}
