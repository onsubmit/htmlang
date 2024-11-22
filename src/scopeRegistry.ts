import { Scope } from './scope';

class ScopeRegistry {
  private _scopes: Map<string, Scope>;

  constructor() {
    this._scopes = new Map();
  }

  has = (id: string): boolean => {
    return this._scopes.has(id);
  };

  get = (id: string): Scope => {
    const scope = this._scopes.get(id);
    if (!scope) {
      throw new Error(`Scope with id ${id} is not registered`);
    }

    return scope;
  };

  remove = (scopeId: string): boolean => {
    return this._scopes.delete(scopeId);
  };

  clear = (): void => {
    this._scopes.clear();
  };

  createAndAdd = (id: string, parent: Scope | null): Scope => {
    const scope = new Scope(id, parent);
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
