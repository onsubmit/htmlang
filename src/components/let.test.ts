import { globalScope, traverseDomTree } from '../main';

describe('let', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should declare a variable', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <let- i="2"></let->
    `;
    document.body.appendChild(container);
    traverseDomTree();

    expectVariableToBe('i', 2);
  });

  it('should declare multiple variables', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <let- i="2" j="3"></let->
    `;
    document.body.appendChild(container);
    traverseDomTree();

    expectVariableToBe('i', 2);
    expectVariableToBe('j', 3);
  });

  it('should reference other variables', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <let- i="2" j="{i} * 2"></let->
      <let- k="2 * {j}" l="{i} * {k}"></let->
    `;
    document.body.appendChild(container);
    traverseDomTree();

    expectVariableToBe('i', 2);
    expectVariableToBe('j', 4);
    expectVariableToBe('k', 8);
    expectVariableToBe('l', 16);
  });

  it('should allow changing the value', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <let- i="2"></const->
      <statement- (="i = 3")></statement->
    `;
    document.body.appendChild(container);
    expect(traverseDomTree).not.toThrow('Assignment to constant variable.');

    const result = globalScope.getVariable('i');
    expect(result.found && result.variable.value).toBe(3);
  });

  function expectVariableToBe(name: string, value: any): void {
    const result = globalScope.getVariable(name);
    expect(result.found).toBe(true);
    expect(result.found && result.variable.value).toBe(value);
  }
});
