import { FunctionEx } from './functionEx';
import { Scope } from './scope';

export type VariableType = 'let' | 'const';
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
    for (const match of matches) {
      const varName = match.groups!['VAR_NAME'];
      fn(varName);
    }
  };

  get type(): VariableType {
    return this._type;
  }

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
    let evaluable = this._expandVariables(value);
    evaluable = this._expandFunctions(evaluable);

    if (evaluable !== value) {
      return this._expand(evaluable);
    }

    return value;
  };

  private _expandVariables(value: string): string {
    let evaluable = value;

    Variable.forEach(value, (varName) => {
      const result = this._scope.getVariable(varName);
      if (result.found) {
        evaluable = evaluable.replaceAll(`{${varName}}`, result.value._raw);
      }
    });

    return evaluable;
  }

  private _expandFunctions(value: string): string {
    let evaluable = value;
    FunctionEx.forEach(value, (funcName, funcArgs) => {
      const result = this._scope.getFunction(funcName);
      const funcExpression = new RegExp(`${funcName}\\((.*)\\)`, 'g');
      if (result.found) {
        const args = funcArgs.split(',').map((x) => x.trim());
        const returnValue = result.value.execute(null, ...args);
        evaluable = evaluable.replaceAll(funcExpression, returnValue);
      }
    });

    return evaluable;
  }
}
