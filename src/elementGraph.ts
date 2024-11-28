import { ForDash } from './components/for';
import { FunctionDash } from './components/function';
import { BaseHtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';
import { ThrowDash } from './components/throw';

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
      if (!(child instanceof BaseHtmlangElement) || !child.excludeFromElementGraph) {
        graph.addElement(child);
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
