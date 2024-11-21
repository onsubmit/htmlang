import { Variable } from './variable';

export class Scope {
  private _id: string;
  private _variables: Map<string, Variable>;
  private _parent: Scope | null;
  private _children: Map<string, Scope>;

  constructor(id: string, parent: Scope | null) {
    this._id = id;
    this._variables = new Map();
    this._parent = parent;
    this._children = new Map();
  }

  get id(): string {
    return this._id;
  }

  addVariable = (variable: Variable) => {
    if (this._variables.has(variable.name)) {
      throw new Error(`Variable ${name} is already defined in this scope.`);
    }

    this._variables.set(variable.name, variable);
  };

  getVariable = (name: string): { found: boolean; variable: Variable } | { found: false } => {
    let current: Scope | null = this;
    while (current != null) {
      const variable = current._variables.get(name);
      if (variable) {
        return { found: true, variable };
      }

      current = this._parent;
    }

    return { found: false };
  };

  addChildScope = (child: Scope) => {
    if (this._children.has(child.id)) {
      throw new Error(`Child scope with id ${child.id} already exists.`);
    }

    this._children.set(child.id, child);
  };
}
