import { Variable } from '../variable';
import { HtmlangElement } from './htmlangElement';
import { TryDash } from './try';

export class ThrowDash extends HtmlangElement {
  static getTagName = () => 'throw' as const;

  private get _tryElement(): TryDash | undefined {
    let parent = this.parentElement;
    while (parent !== null) {
      if (parent instanceof TryDash) {
        return parent;
      }

      parent = parent.parentElement;
    }
  }

  execute = (): void => {
    const error = this.getAttribute('(') ?? '';
    const evaluated = Variable.expandAll(error, this.parentScope);

    const tryElement = this._tryElement;
    if (tryElement?.catchBlock) {
      tryElement.catchBlock?.catchError(evaluated);
      tryElement.finallyBlock?.continue();
    } else if (tryElement?.finallyBlock) {
      tryElement.finallyBlock?.rethrow(evaluated);
    } else {
      throw new Error(error);
    }
  };
}
