import { FunctionEx } from './functionEx';
import { Variable } from './variable';

type Result<T> = { found: true; value: T } | { found: false; value: undefined };
export class Scope {
  private _id: string;
  private _variables: Map<string, Variable>;
  private _functions: Map<string, FunctionEx>;
  private _parent: Scope | null;

  constructor(id: string, parent: Scope | null) {
    this._id = id;
    this._variables = new Map();
    this._functions = new Map();
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

  getVariable = (name: string): Result<Variable> => {
    return this._getItem(name, this._variables);
  };

  addFunction = (func: FunctionEx): void => {
    if (this._functions.has(func.name)) {
      throw new Error(`Function ${func.name} is already defined in this scope.`);
    }

    this._functions.set(func.name, func);
  };

  getFunction = (name: string): Result<FunctionEx> => {
    return this._getItem(name, this._functions);
  };

  clear = (): void => {
    this._variables.clear();
    this._functions.clear();
  };

  private _getItem = <T>(name: string, map: Map<string, T>): Result<T> => {
    let current: Scope | null = this;
    while (current != null) {
      const func = map.get(name);
      if (func) {
        return { found: true, value: func };
      }

      current = current._parent;
    }

    return { found: false, value: undefined };
  };
}
