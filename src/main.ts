import './style.css';

import { CallDash } from './components/callDash';
import { ConsoleDash } from './components/console';
import { ConstDash } from './components/const';
import { ElseDash } from './components/else';
import { ElseIfDash } from './components/elseIf';
import { ForDash } from './components/for';
import { FunctionDash } from './components/function';
import { BaseHtmlangElement, HtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';
import { LetDash } from './components/let';
import { ScopeDash } from './components/scope';
import { StatementDash } from './components/statement';
import { ElementGraph, skipElementDuringBuild } from './elementGraph';
import { scopeRegistry } from './scopeRegistry';

const globalScope = scopeRegistry.createAndAdd('global', null);
export { globalScope };

export function defineElements(): void {
  const elements: Array<typeof BaseHtmlangElement> = [
    CallDash,
    ConsoleDash,
    ConstDash,
    ElseDash,
    ElseIfDash,
    ForDash,
    FunctionDash,
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
    if (child instanceof HtmlangElement && !skipElementDuringBuild(child)) {
      child.execute();
    }

    traverseChildren(child);
  }
}

defineElements();
ElementGraph.build().execute();
