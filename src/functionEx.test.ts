import { FunctionEx } from './functionEx';

describe('functionEx', () => {
  it('should recursively parse arguments', () => {
    const cb = vi.fn();

    const expression = 'foo(1, bar(2))';
    FunctionEx.forEach(expression, cb);

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenNthCalledWith(1, 'bar', '2');
    expect(cb).toHaveBeenNthCalledWith(2, 'foo', '1, bar(2)');
  });
});
