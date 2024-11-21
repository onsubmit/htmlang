import { Scope } from './scope';

class ScopeRegistry {
  private _scopes: Map<string, Scope>;

  constructor() {
    this._scopes = new Map();
  }

  get = (id: string): Scope => {
    const scope = this._scopes.get(id);
    if (!scope) {
      throw new Error(`Scope with id ${id} is not registered`);
    }

    return scope;
  };

  remove = (scope: Scope): void => {
    if (!this._scopes.has(scope.id)) {
      throw new Error(`Scope with id ${scope.id} is not registered`);
    }

    this._scopes.delete(scope.id);
  };

  createAndAdd = (id: string, parent: Scope | null): Scope => {
    const scope = new Scope(id, parent);
    parent?.addChildScope(scope);
    this._add(scope);
    return scope;
  };

  private _add = (scope: Scope): void => {
    if (this._scopes.has(scope.id)) {
      throw new Error(`Scope with ${scope.id} has already been registered.`);
    }

    this._scopes.set(scope.id, scope);
  };
}

const scopeRegistry = new ScopeRegistry();
export { scopeRegistry };