import { ElseDash } from './components/else';
import { ElseIfDash } from './components/elseIf';
import { ForDash } from './components/for';
import { HtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';

const skipped = [ElseDash, ElseIfDash] as const;
export function skipElement(element: Element): boolean {
  return skipped.some((type) => element instanceof type);
}

export class ElementGraph {
  elements: Map<HtmlangElement, ElementGraph>;

  static build = (
    graph: ElementGraph = new ElementGraph(),
    element: Element = document.body,
  ): ElementGraph => {
    for (const child of element.children) {
      if (child instanceof HtmlangElement && !skipElement(child)) {
        graph.addElement(child);
      }
    }

    for (const child of element.children) {
      if (child instanceof HtmlangElement) {
        if (!skipElement(child)) {
          ElementGraph.build(graph.elements.get(child), child);
        }
      } else {
        ElementGraph.build(graph, child);
      }
    }

    return graph;
  };

  execute = (): void => {
    for (const [element, childGraph] of this.elements.entries()) {
      element.execute();

      if (element instanceof IfDash || element instanceof ForDash) {
        continue;
      }

      childGraph.execute();
    }
  };

  constructor() {
    this.elements = new Map();
  }

  addElement = (element: HtmlangElement): void => {
    this.elements.set(element, new ElementGraph());
  };
}
