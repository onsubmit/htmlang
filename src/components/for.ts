import { traverseChildren } from '../main';
import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class ForDash extends BaseHtmlangElement {
  static getTagName = () => 'for' as const;

  static observedAttributes = ['('];

  executesOwnChildren = true;

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (this.initialInnerHTML === null) {
      return;
    }

    if (name === '(') {
      if (oldValue !== newValue) {
        this._loop(newValue);
      }
    }
  }

  execute = (): void => {
    this._loop(this.getAttribute('(') ?? '');
  };

  private _loop(attribute: string): void {
    this.innerHTML = '';
    const { varName, array } = this.getLoopParams(attribute);

    for (const item of array) {
      const div = document.createElement('div');
      div.style.display = 'none';
      div.innerHTML = this.initialInnerHTML!.replaceAll(`{${varName}}`, item);
      this.appendChild(div);
      traverseChildren(div);
      this.removeChild(div);
      this.innerHTML += div.innerHTML;
    }
  }

  private getLoopParams(attribute: string): { varName: string; array: Array<any> } {
    const split = attribute.split(' of ').map((x) => x.trim());

    if (split.length !== 2) {
      throw new Error(`Attribute must be of the form "<variable> of <array>". Found: ${attribute}`);
    }

    const [varName, arrStr] = split;
    const arrVarName = Variable.getName(arrStr);

    let array: Array<any> | null = null;
    if (arrVarName) {
      const result = this.parentScope.getVariable(arrVarName);
      if (result.found) {
        array = result.value.value;
      }
    }

    array = array ?? eval(arrStr);

    if (!Array.isArray(array)) {
      throw new Error(`Could not parse iterable from the attribute: ${attribute}. Found: ${array}`);
    }

    return { varName, array };
  }
}
