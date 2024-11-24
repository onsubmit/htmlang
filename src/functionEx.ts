import { CallDash } from './components/callDash';
import { FunctionDash } from './components/function';
import { traverseChildren } from './main';
import { Variable } from './variable';

export class FunctionEx {
  private _functionElement: FunctionDash;
  private _name: string;
  private _arguments: Array<string>;

  constructor(element: FunctionDash, name: string, args: Array<string>) {
    this._functionElement = element;
    this._name = name;
    this._arguments = args;
  }

  get name(): string {
    return this._name;
  }

  execute = (caller: CallDash, ...args: any[]): any => {
    const variables: Array<Variable> = [];
    for (let i = 0; i < Math.min(args.length, this._arguments.length); i++) {
      const variable = new Variable(
        'let',
        this._arguments[i],
        args[i],
        this._functionElement.scope,
      );
      variables.push(variable);
      this._functionElement.scope.addVariable(variable);
    }

    traverseChildren(this._functionElement);
    this._functionElement.setup(caller);

    for (const variable of variables) {
      this._functionElement.scope.removeVariable(variable);
    }

    this._functionElement.teardown();
  };
}
