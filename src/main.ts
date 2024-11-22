import './style.css';

import { ConsoleDash } from './components/console';
import { ConstDash } from './components/const';
import { ForDash } from './components/for';
import { BaseHtmlangElement, HtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';
import { LetDash } from './components/let';
import { ScopeDash } from './components/scope';
import { StatementDash } from './components/statement';
import { scopeRegistry } from './scopeRegistry';

const globalScope = scopeRegistry.createAndAdd('global', null);
export { globalScope };

const elements: Array<typeof BaseHtmlangElement> = [
  ConsoleDash,
  ConstDash,
  ForDash,
  IfDash,
  LetDash,
  ScopeDash,
  StatementDash,
];

for (const element of elements) {
  customElements.define(`${element.getTagName()}-`, element);
}

(function traverseDomTree(element: Element = document.body) {
  if (element instanceof HtmlangElement) {
    element.execute();
  }

  for (const child of element.children) {
    traverseDomTree(child);
  }
})();
