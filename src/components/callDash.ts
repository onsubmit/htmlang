import { Variable } from '../variable';
import { HtmlangElement } from './htmlangElement';

export class CallDash extends HtmlangElement {
  static getTagName = () => 'call' as const;

  execute = (): void => {
    if (this.attributes.length === 0) {
      throw new Error('Missing function name');
    }

    const funcAttr = this.attributes[0];
    const name = funcAttr.name.endsWith('(') ? funcAttr.name.slice(0, -1) : funcAttr.name;

    const { found, value: func } = this.parentScope.getFunction(name);
    if (!found) {
      throw new Error(`Function named ${name} not found in this scope.`);
    }

    const argsRaw = Variable.expandAll(funcAttr.value, this.parentScope);
    const args = argsRaw.split(',').map((x) => x.trim());
    func.execute(this, ...args);
  };
}
