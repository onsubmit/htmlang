import { HtmlangElement } from './htmlangElement';

export class ConsoleDash extends HtmlangElement {
  connectedCallback() {
    super.connectedCallback();

    let log = this.getAttribute('log(');
    if (!log) {
      return;
    }

    const matches = log.matchAll(/{(?<VAR_NAME>\S+)}/g);
    if (!matches) {
      return;
    }

    for (const match of matches) {
      const varName = match.groups?.['VAR_NAME'];
      if (!varName) {
        continue;
      }

      log = log.replaceAll(`{${varName}}`, this.parentScope?.getVariable(varName));
    }

    console.log(log);
  }
}
