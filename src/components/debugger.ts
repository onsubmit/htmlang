import { BaseHtmlangElement } from './htmlangElement';

export class DebuggerDash extends BaseHtmlangElement {
  static getTagName = () => 'debugger' as const;

  /* istanbul ignore next */
  execute = (): void => {
    // eslint-disable-next-line no-debugger
    debugger;
  };
}
