import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class ConsoleDash extends BaseHtmlangElement {
  static getTagName = () => 'console' as const;

  execute = (): void => {
    const log = this.getAttribute('log(');
    if (!log) {
      return;
    }

    const expanded = Variable.expandAll(log, this.parentScope);
    console.log(expanded);
  };
}
