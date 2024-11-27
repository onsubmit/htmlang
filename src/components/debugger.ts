import { HtmlangElement } from './htmlangElement';

/* istanbul ignore file */
export class DebuggerDash extends HtmlangElement {
  static getTagName = () => 'debugger' as const;

  execute = (): void => {
    // eslint-disable-next-line no-debugger
    debugger;
  };
}
