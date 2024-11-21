export class Scope {
  private _id: string;
  private _variables: Map<string, any>;
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

  addVariable = (name: string, value: any) => {
    if (this._variables.has(name)) {
      throw new Error(`Variable ${name} is already defined in this scope.`);
    }

    this._variables.set(name, value);
  };

  getVariable = (name: string): any => {
    let current: Scope | null = this;
    while (current != null) {
      if (current._variables.has(name)) {
        return current._variables.get(name);
      }

      current = this._parent;
    }
  };

  addChildScope = (child: Scope) => {
    if (this._children.has(child.id)) {
      throw new Error(`Child scope with id ${child.id} already exists.`);
    }

    this._children.set(child.id, child);
  };
}
