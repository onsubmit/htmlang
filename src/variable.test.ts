import { globalScope } from './main';
import { Variable } from './variable';

describe('variable', () => {
  it('can create a new const variable', () => {
    const variable = new Variable('const', 'name', "'Andy'", globalScope);
    expect(variable.name).toBe('name');
    expect(variable.value).toBe('Andy');
    expect(() => variable.set('Joe')).toThrow('Assignment to constant variable.');
  });

  it('can create a new let variable', () => {
    const variable = new Variable('let', 'age', '42', globalScope);
    expect(variable.name).toBe('age');
    expect(variable.value).toBe(42);
    expect(() => variable.set('43')).not.toThrow('Assignment to constant variable.');
    expect(variable.value).toBe(43);
  });

  it('can parse a variable name from an expression', () => {
    expect(Variable.getName('{name}')).toBe('name');
    expect(Variable.getName('{age}')).toBe('age');
    expect(Variable.getName('invalid')).toBeUndefined();
  });

  it('can perform an action on each variable from an expression', () => {
    const cb = vi.fn();

    Variable.forEach('I am {name}. I am {age} years old and like {sport}', cb);

    expect(cb).toHaveBeenCalledTimes(3);
    expect(cb).toHaveBeenNthCalledWith(1, 'name');
    expect(cb).toHaveBeenNthCalledWith(2, 'age');
    expect(cb).toHaveBeenNthCalledWith(3, 'sport');
  });
});
