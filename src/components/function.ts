import { FunctionEx } from '../functionEx';
import { Variable } from '../variable';
import { CallDash } from './callDash';
import { HtmlangElement } from './htmlangElement';

export class FunctionDash extends HtmlangElement {
  static getTagName = () => 'function' as const;

  private _function: FunctionEx | null = null;

  private _lastReturnValue: any;

  connectedCallback(): void {
    super.connectedCallback();
    this.style.display = 'none';
  }

  disconnectedCallback(): void {
    if (this._function) {
      this.parentScope.removeFunction(this._function);
    }

    super.disconnectedCallback();
  }

  get lastReturnValue(): any {
    return this._lastReturnValue;
  }

  execute = (): void => {
    const { name, args } = this._getFunction();
    this._function = new FunctionEx(this, name, args);
    this.parentScope.addFunction(this._function);
  };

  return = (value: any): void => {
    this._lastReturnValue = value;
  };

  applyResult = (caller: CallDash | null): void => {
    if (!caller) {
      return;
    }

    const innerHtml = Variable.expandAll(this.initialInnerHTML, this.scope);
    caller.innerHTML = innerHtml;
  };

  cleanup = (): void => {
    this.scope.clear();
  };

  private _getFunction = (): { name: string; args: Array<string> } => {
    let funcAttr: Attr | undefined;
    const attributes = [...this.attributes];
    for (const attribute of attributes) {
      if (!(attribute.name in this)) {
        funcAttr = attribute;
        break;
      }
    }

    if (!funcAttr) {
      const tagName = this.tagName.toLowerCase();
      const attributesMarkup = attributes.map((a) => `${a.name}="${a.value}"`).join(' ');
      const markup = `<${tagName}${attributesMarkup ? ' ' + attributesMarkup : ''}></${tagName}>`;
      throw new Error(`Could not find function name attribute from: ${markup}"`);
    }

    const name = funcAttr.name.endsWith('(') ? funcAttr.name.slice(0, -1) : funcAttr.name;
    const args = funcAttr.value.split(',').map((a) => a.trim());
    return { name, args };
  };
}
