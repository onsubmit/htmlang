import './style.css';

import { BreakDash } from './components/break';
import { CallDash } from './components/callDash';
import { CaseDash } from './components/case';
import { CatchDash } from './components/catch';
import { ConsoleDash } from './components/console';
import { ConstDash } from './components/const';
import { DebuggerDash } from './components/debugger';
import { DefaultDash } from './components/default';
import { ElseDash } from './components/else';
import { ElseIfDash } from './components/elseIf';
import { FinallyDash } from './components/finally';
import { ForDash } from './components/for';
import { FunctionDash } from './components/function';
import { BaseHtmlangElement, HtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';
import { LetDash } from './components/let';
import { ReturnDash } from './components/return';
import { ScopeDash } from './components/scope';
import { StatementDash } from './components/statement';
import { SwitchDash } from './components/switch';
import { ThrowDash } from './components/throw';
import { TryDash } from './components/try';
import { ElementGraph, skipElementDuringBuild } from './elementGraph';
import { scopeRegistry } from './scopeRegistry';

const globalScope = scopeRegistry.createAndAdd('global', null);
export { globalScope };

export function defineElements(): void {
  const elements: Array<typeof BaseHtmlangElement> = [
    BreakDash,
    CallDash,
    CatchDash,
    CaseDash,
    ConsoleDash,
    ConstDash,
    DebuggerDash,
    DefaultDash,
    ElseDash,
    ElseIfDash,
    FinallyDash,
    ForDash,
    FunctionDash,
    IfDash,
    LetDash,
    ReturnDash,
    ScopeDash,
    SwitchDash,
    StatementDash,
    ThrowDash,
    TryDash,
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
      child.execute?.();
    }

    if (
      child instanceof IfDash ||
      child instanceof ElseIfDash ||
      child instanceof ElseDash ||
      child instanceof CallDash ||
      child instanceof SwitchDash ||
      child instanceof TryDash
    ) {
      continue;
    }

    traverseChildren(child);
  }
}

defineElements();
const graph = ElementGraph.build();
graph.execute();
