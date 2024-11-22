import { Scope } from './scope';

type VariableType = 'let' | 'const';
export class Variable {
  private _type: VariableType;
  private _name: string;
  private _raw: string;
  private _scope: Scope;

  constructor(type: VariableType, name: string, raw: string, scope: Scope) {
    this._type = type;
    this._name = name;
    this._raw = raw;
    this._scope = scope;
  }

  static getName = (string: string): string | undefined => {
    const match = string.match(/^{(?<VAR_NAME>\S+)}$/);
    const varName = match?.groups?.['VAR_NAME'];
    return varName;
  };

  static forEach = (string: string, fn: (varName: string) => void): void => {
    const matches = string.matchAll(/{(?<VAR_NAME>\S+)}/g);
    if (!matches) {
      return;
    }

    for (const match of matches) {
      const varName = match.groups?.['VAR_NAME'];
      if (!varName) {
        continue;
      }

      fn(varName);
    }
  };

  get name(): string {
    return this._name;
  }

  set = (raw: string): void => {
    if (this._type === 'const') {
      throw new TypeError('Assignment to constant variable.');
    }

    this._raw = raw;
  };

  get value(): any {
    const evaluable = this._expand(this._raw);
    return eval(evaluable);
  }

  private _expand = (value: string): string => {
    let evaluable = value;

    Variable.forEach(value, (varName) => {
      const result = this._scope.getVariable(varName);
      if (result.found) {
        evaluable = evaluable.replaceAll(`{${varName}}`, result.variable._raw);
      }
    });

    if (evaluable !== value) {
      return this._expand(evaluable);
    }

    return value;
  };
}
