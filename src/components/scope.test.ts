import { ElementGraph } from '../elementGraph';
import { globalScope } from '../main';
import { Scope } from '../scope';
import { ScopeDash } from './scope';

describe('scope', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should declare a new scope', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="2"></const->
      <console- log(="outer scope: {i} should be 2" )></console->
      <scope- id="inner">
        <const- i="3"></const->
        <console- log(="inner scope: {i} should be 3" )></console->
      </scope->
      <console- log(="outer scope: {i} should still be 2" )></console->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    const inner = document.querySelector<ScopeDash>('#inner')!;

    expectVariableToBe(globalScope, 'i', 2);
    expectVariableToBe(inner.scope, 'i', 3);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 'outer scope: 2 should be 2');
    expect(spy).toHaveBeenNthCalledWith(2, 'inner scope: 3 should be 3');
    expect(spy).toHaveBeenNthCalledWith(3, 'outer scope: 2 should still be 2');
  });

  function expectVariableToBe(scope: Scope, name: string, value: any): void {
    const result = scope.getVariable(name);
    expect(result.found).toBe(true);
    expect(result.found && result.value.value).toBe(value);
  }
});
