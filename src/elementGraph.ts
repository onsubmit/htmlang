import { CaseDash } from './components/case';
import { CatchDash } from './components/catch';
import { DefaultDash } from './components/default';
import { ElseDash } from './components/else';
import { ElseIfDash } from './components/elseIf';
import { FinallyDash } from './components/finally';
import { ForDash } from './components/for';
import { FunctionDash } from './components/function';
import { BaseHtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';
import { ThrowDash } from './components/throw';

const skipDuringBuild = [
  ElseDash,
  ElseIfDash,
  CaseDash,
  DefaultDash,
  CatchDash,
  FinallyDash,
] as const;
export function skipElementDuringBuild(element: Element): boolean {
  return skipDuringBuild.some((type) => element instanceof type);
}

const skipDuringExecution = [ForDash, FunctionDash, IfDash] as const;
export function skipElementDuringExecution(element: Element): boolean {
  return skipDuringExecution.some((type) => element instanceof type);
}

export class ElementGraph {
  elements: Map<Element, ElementGraph>;

  static build = (
    graph: ElementGraph = new ElementGraph(),
    element: Element = document.body,
  ): ElementGraph => {
    for (const child of element.children) {
      if (!skipElementDuringBuild(child)) {
        graph.addElement(child);
      }
    }

    for (const child of element.children) {
      if (!skipElementDuringBuild(child)) {
        ElementGraph.build(graph.elements.get(child), child);
      }
    }

    return graph;
  };

  execute = (): void => {
    let threw = false;
    for (const [element, childGraph] of this.elements.entries()) {
      if (threw) {
        return;
      }

      if (element instanceof BaseHtmlangElement) {
        element.execute?.();
        threw = element instanceof ThrowDash;

        if (skipElementDuringExecution(element)) {
          continue;
        }
      }

      childGraph.execute();
    }
  };

  constructor() {
    this.elements = new Map();
  }

  addElement = (element: Element): void => {
    this.elements.set(element, new ElementGraph());
  };
}
