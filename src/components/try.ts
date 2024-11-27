import { CatchDash } from './catch';
import { FinallyDash } from './finally';
import { HtmlangElement } from './htmlangElement';

export class TryDash extends HtmlangElement {
  static getTagName = () => 'try' as const;

  private get _siblings(): {
    catchBlock: CatchDash | undefined;
    finallyBlock: FinallyDash | undefined;
  } {
    let catchBlock: CatchDash | undefined;
    let finallyBlock: FinallyDash | undefined;
    let sibling = this.nextElementSibling;
    while (sibling !== null) {
      if (sibling instanceof CatchDash) {
        if (catchBlock) {
          throw new Error('Only one <catch-> block is allowed.');
        }
        catchBlock = sibling;
      } else if (sibling instanceof FinallyDash) {
        if (finallyBlock) {
          throw new Error('Only one <finally-> block is allowed.');
        }
        finallyBlock = sibling;
      }

      sibling = sibling.nextElementSibling;
    }

    if (!catchBlock && !finallyBlock) {
      throw new Error('<try-> block must have a <catch-> or <finally-> block, or both.');
    }

    return { catchBlock, finallyBlock };
  }

  get catchBlock(): CatchDash | undefined {
    const { catchBlock } = this._siblings;
    return catchBlock;
  }

  get finallyBlock(): FinallyDash | undefined {
    const { finallyBlock } = this._siblings;
    return finallyBlock;
  }
}
