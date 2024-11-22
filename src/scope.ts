import { Variable } from './variable';

export class Scope {
  private _id: string;
  private _variables: Map<string, Variable>;
  private _parent: Scope | null;

  constructor(id: string, parent: Scope | null) {
    this._id = id;
    this._variables = new Map();
    this._parent = parent;
  }

  get id(): string {
    return this._id;
  }

  addVariable = (variable: Variable): void => {
    if (this._variables.has(variable.name)) {
      throw new Error(`Variable ${variable.name} is already defined in this scope.`);
    }

    this._variables.set(variable.name, variable);
  };

  removeVariable = (variable: Variable): void => {
    if (!this._variables.has(variable.name)) {
      throw new Error(`Variable ${variable.name} not found in this scope.`);
    }

    this._variables.delete(variable.name);
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
}
