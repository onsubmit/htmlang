import { ElseDash } from './components/else';
import { ElseIfDash } from './components/elseIf';
import { ForDash } from './components/for';
import { FunctionDash } from './components/function';
import { HtmlangElement } from './components/htmlangElement';
import { IfDash } from './components/if';

const skipDuringBuild = [ElseDash, ElseIfDash] as const;
export function skipElementDuringBuild(element: Element): boolean {
  return skipDuringBuild.some((type) => element instanceof type);
}

const skipDuringExecution = [ForDash, FunctionDash, IfDash] as const;
export function skipElementDuringExecution(element: Element): boolean {
  return skipDuringExecution.some((type) => element instanceof type);
}

export class ElementGraph {
  elements: Map<HtmlangElement, ElementGraph>;

  static build = (
    graph: ElementGraph = new ElementGraph(),
    element: Element = document.body,
  ): ElementGraph => {
    for (const child of element.children) {
      if (child instanceof HtmlangElement && !skipElementDuringBuild(child)) {
        graph.addElement(child);
      }
    }

    for (const child of element.children) {
      if (child instanceof HtmlangElement) {
        if (!skipElementDuringBuild(child)) {
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

      if (skipElementDuringExecution(element)) {
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
