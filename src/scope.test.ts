import { Scope } from './scope';
import { Variable } from './variable';

describe('Scope', () => {
  it('should create a new Scope with no parent', () => {
    const scope = new Scope('id', null);
    expect(scope.id).toBe('id');
  });

  it('should add a new variable', () => {
    const scope = new Scope('id', null);
    scope.addVariable(new Variable('const', 'name', '10', scope));
    expectVariableToBe(scope, 'name', 10);
  });

  it('should remove a variable', () => {
    const scope = new Scope('id', null);
    const variable = new Variable('const', 'name', '10', scope);
    scope.addVariable(variable);
    expectVariableToBe(scope, 'name', 10);
    scope.removeVariable(variable);
    expect(scope.getVariable('name').found).toBe(false);
  });

  it('should return false when removing an unknown variable', () => {
    const scope = new Scope('id', null);
    const variable = new Variable('const', 'name', '10', scope);
    expect(scope.removeVariable(variable)).toBe(false);
  });

  function expectVariableToBe(scope: Scope, name: string, value: any): void {
    const result = scope.getVariable(name);
    expect(result.found).toBe(true);
    expect(result.found && result.value.value).toBe(value);
  }
});
