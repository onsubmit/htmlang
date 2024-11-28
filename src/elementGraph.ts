import { BaseHtmlangElement } from './components/htmlangElement';
import { ThrowDash } from './components/throw';

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

        if (element.executesOwnChildren) {
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
