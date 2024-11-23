import './style.css';

import { ConsoleDash } from './components/console';
import { ConstDash } from './components/const';
import { ElseDash } from './components/else';
import { ElseIfDash } from './components/elseIf';
import { ForDash } from './components/for';
import { BaseHtmlangElement, HtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';
import { LetDash } from './components/let';
import { ScopeDash } from './components/scope';
import { StatementDash } from './components/statement';
import { scopeRegistry } from './scopeRegistry';

const globalScope = scopeRegistry.createAndAdd('global', null);
export { globalScope };

export function defineElements(): void {
  const elements: Array<typeof BaseHtmlangElement> = [
    ConsoleDash,
    ConstDash,
    ElseDash,
    ElseIfDash,
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

const skipped = [ElseDash, ElseIfDash] as const;
export function traverseDomTree(element: Element = document.body): void {
  if (element instanceof HtmlangElement && !skipped.some((type) => element instanceof type)) {
    element.execute();
  }

  for (const child of element.children) {
    traverseDomTree(child);
  }
}

defineElements();
traverseDomTree();
