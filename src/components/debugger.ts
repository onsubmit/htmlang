import { HtmlangElement } from './htmlangElement';

export class DebuggerDash extends HtmlangElement {
  static getTagName = () => 'debugger' as const;

  /* istanbul ignore next */
  execute = (): void => {
    // eslint-disable-next-line no-debugger
    debugger;
  };
}
