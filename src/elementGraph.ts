import { BaseHtmlangElement } from './components/htmlangElement';
import { ThrowDash } from './components/throw';

export class ElementGraph {
  private _elements: Map<Element, ElementGraph>;

  static build = (
    graph: ElementGraph = new ElementGraph(),
    element: Element = document.body,
  ): ElementGraph => {
    for (const child of element.children) {
      if (element instanceof BaseHtmlangElement && element.excludeFromExecution) {
        continue;
      }

      const newGraph = graph.addElement(child);
      ElementGraph.build(newGraph, child);
    }

    return graph;
  };

  static traverseChildren = (element: Element): void => {
    for (const child of element.children) {
      if (child instanceof BaseHtmlangElement) {
        if (child.excludeFromExecution) {
          continue;
        }

        child.execute?.();

        if (child.executesOwnChildren) {
          continue;
        }
      }

      ElementGraph.traverseChildren(child);
    }
  };

  constructor() {
    this._elements = new Map();
  }

  execute = (): void => {
    let threw = false;
    for (const [element, childGraph] of this._elements.entries()) {
      if (threw) {
        return;
      }

      if (element instanceof BaseHtmlangElement) {
        if (element.excludeFromExecution) {
          continue;
        }

        element.execute?.();
        threw = element instanceof ThrowDash;

        if (element.executesOwnChildren) {
          continue;
        }
      }

      childGraph.execute();
    }
  };

  addElement = (element: Element): ElementGraph => {
    const graph = new ElementGraph();
    this._elements.set(element, graph);
    return graph;
  };
}
