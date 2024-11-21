export class ConsoleDash extends HTMLElement {
  connectedCallback() {
    const log = this.getAttribute('log(');
    console.log(log);
  }
}
