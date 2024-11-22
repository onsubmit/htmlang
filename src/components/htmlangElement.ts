import { v4 as uuidv4 } from 'uuid';

import { globalScope } from '../main';
import { Scope } from '../scope';
import { scopeRegistry } from '../scopeRegistry';

export abstract class HtmlangElement extends HTMLElement {
  private _scopeId = uuidv4();
  private _parentScope: Scope | null = null;
  private _originalSetAttribute = this.setAttribute;

  constructor() {
    super();
    this.setAttribute = this._setAttribute;
  }

  disconnectedCallback(): void {
    scopeRegistry.remove(this._scopeId);
  }

  get scope(): Scope {
    if (!scopeRegistry.has(this._scopeId)) {
      return this._registerScope().current;
    }

    return scopeRegistry.get(this._scopeId);
  }

  get parentScope(): Scope {
    if (!this._parentScope) {
      return this._registerScope().parent;
    }

    return this._parentScope;
  }

  abstract execute(): void;

  private _getParentScope = (): Scope => {
    let parent = this.parentElement;
    while (parent !== null) {
      if (parent instanceof HtmlangElement) {
        return scopeRegistry.get(parent.scope.id);
      } else {
        parent = parent.parentElement;
      }
    }

    return globalScope;
  };

  protected _registerScope = (): { current: Scope; parent: Scope } => {
    this._parentScope = this._getParentScope();
    return {
      current: scopeRegistry.createAndAdd(this._scopeId, this._parentScope),
      parent: this._parentScope,
    };
  };

  private _setAttribute = (qualifiedName: string, value: string): void => {
    try {
      this._originalSetAttribute(qualifiedName, value);
    } catch {
      const parser = document.createElement('div');
      parser.innerHTML = `<br ${qualifiedName} />`;
      const attr = parser.firstElementChild!.attributes.removeNamedItem(qualifiedName);
      attr.value = value;
      this.attributes.setNamedItem(attr);
    }
  };
}

export class BaseHtmlangElement extends HtmlangElement {
  static getTagName(): string {
    throw new Error('Tag name not set');
  }

  execute(): void {
    throw new Error('Method not implemented.');
  }
}
