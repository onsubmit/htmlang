import './style.css';

import { ConsoleDash } from './components/console';
import { ConstDash } from './components/const';
import { ElseDash } from './components/else';
import { ElseIfDash } from './components/elseIf';
import { EventDash } from './components/event';
import { ForDash } from './components/for';
import { BaseHtmlangElement, HtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';
import { LetDash } from './components/let';
import { ScopeDash } from './components/scope';
import { StatementDash } from './components/statement';
import { ElementGraph, skipElement } from './elementGraph';
import { scopeRegistry } from './scopeRegistry';

const globalScope = scopeRegistry.createAndAdd('global', null);
export { globalScope };

export function defineElements(): void {
  const elements: Array<typeof BaseHtmlangElement> = [
    ConsoleDash,
    ConstDash,
    ElseDash,
    ElseIfDash,
    EventDash,
    ForDash,
    IfDash,
    LetDash,
    ScopeDash,
    StatementDash,
  ];

  for (const element of elements) {
    const name = `${element.getTagName()}-`;
    if (!customElements.get(name)) {
      customElements.define(name, element);
    }
  }
}

export function traverseChildren(element: Element): void {
  for (const child of element.children) {
    if (child instanceof HtmlangElement && !skipElement(child)) {
      child.execute();
    }

    traverseChildren(child);
  }
}

defineElements();
ElementGraph.build().execute();
