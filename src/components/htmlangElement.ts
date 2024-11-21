import { v4 as uuidv4 } from 'uuid';

import { globalScope } from '../main';
import { Scope } from '../scope';
import { scopeRegistry } from '../scopeRegistry';

export abstract class HtmlangElement extends HTMLElement {
  protected _scopeId = uuidv4();
  private _parentScope: Scope | null = null;

  connectedCallback() {
    this._parentScope = this._getParentScope();
    scopeRegistry.createAndAdd(this._scopeId, this._parentScope);
  }

  get scopeId(): string {
    return this._scopeId;
  }

  get parentScope(): Scope | null {
    return this._parentScope;
  }

  protected _getParentScope = (): Scope => {
    let parent = this.parentElement;
    while (parent !== null) {
      if (parent instanceof HtmlangElement) {
        return scopeRegistry.get(parent.scopeId);
      } else {
        parent = parent.parentElement;
      }
    }

    return globalScope;
  };
}
