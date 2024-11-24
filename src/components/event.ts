import { traverseChildren } from '../main';
import { BaseHtmlangElement } from './htmlangElement';

export class EventDash extends BaseHtmlangElement {
  static getTagName = () => 'event' as const;

  execute = (): void => {
    const on = this.getAttribute('on');
    if (!on) {
      return;
    }

    const target = this.getAttribute('target');
    if (!target) {
      return;
    }

    const targetElements = document.querySelectorAll(target);
    if (!targetElements) {
      return;
    }

    targetElements.forEach((element) => {
      element.addEventListener(on, () => traverseChildren(this));
    });
  };
}
