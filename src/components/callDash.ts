import { Variable } from '../variable';
import { HtmlangElement } from './htmlangElement';

export class CallDash extends HtmlangElement {
  static getTagName = () => 'call' as const;

  execute(): void {
    if (this.attributes.length === 0) {
      throw new Error('Missing function name');
    }

    const funcAttr = this.attributes[0];
    const name = funcAttr.name.endsWith('(') ? funcAttr.name.slice(0, -1) : funcAttr.name;

    const { found, value: func } = this.parentScope.getFunction(name);
    if (!found) {
      throw new Error(`Function named ${name} not found in this scope.`);
    }

    let argsRaw = funcAttr.value;
    Variable.forEach(argsRaw, (varName) => {
      const result = this.parentScope.getVariable(varName);
      const value = result.found ? result.value.value : undefined;
      argsRaw = argsRaw.replaceAll(`{${varName}}`, value);
    });

    const args = argsRaw.split(',').map((x) => x.trim());
    func.execute(this, ...args);
  }
}
