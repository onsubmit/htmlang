import { ElementGraph } from '../elementGraph';
import { globalScope } from '../main';
import { ConstDash } from './const';

describe('const', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should declare a variable', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="2"></const->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expectVariableToBe('i', 2);
  });

  it('should declare multiple variables', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="2" j="3"></const->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expectVariableToBe('i', 2);
    expectVariableToBe('j', 3);
  });

  it('should disallow changing the value', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="2"></const->
      <statement- (="i = 3")></statement->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Assignment to constant variable.');

    expectVariableToBe('i', 2);
  });

  it('should reference other variables', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="2" j="{i} * 2"></const->
      <const- k="2 * {j}" l="{i} * {k}"></const->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expectVariableToBe('i', 2);
    expectVariableToBe('j', 4);
    expectVariableToBe('k', 8);
    expectVariableToBe('l', 16);
  });

  it('should throw if variable is already declared', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="2"></const->
      <const- i="3"></const->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Variable i is already defined in this scope.');
  });

  it('should remove declaration when scope is destroyed', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="2"></const->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expectVariableToBe('i', 2);

    const constDash = document.querySelector<ConstDash>('const-')!;
    container.removeChild(constDash);

    const { found } = globalScope.getVariable('i');
    expect(found).toBe(false);
  });

  function expectVariableToBe(name: string, value: any): void {
    const result = globalScope.getVariable(name);
    expect(result.found).toBe(true);
    expect(result.found && result.variable.value).toBe(value);
  }
});
