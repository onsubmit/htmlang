import { scopeRegistry } from './scopeRegistry';

describe('scopeRegistry', () => {
  beforeEach(() => {
    scopeRegistry.clear();
  });

  it('should register a scope', () => {
    const global = scopeRegistry.createAndAdd('my-global', null);
    expect(scopeRegistry.has('my-global')).toBe(true);
    expect(scopeRegistry.get('my-global')).toEqual(global);
  });

  it('should remove a scope', () => {
    scopeRegistry.createAndAdd('my-global', null);
    expect(scopeRegistry.remove('my-global')).toBe(true);
    expect(scopeRegistry.has('my-global')).toBe(false);
    expect(scopeRegistry.remove('my-global')).toBe(false);
  });

  it('should throw if reregistering a scope', () => {
    scopeRegistry.createAndAdd('my-global', null);
    expect(() => scopeRegistry.createAndAdd('my-global', null)).toThrow(
      'Scope with my-global has already been registered.',
    );
  });

  it('should throw if getting an unknown scope', () => {
    expect(() => scopeRegistry.get('unknown')).toThrow('Scope with id unknown is not registered');
  });
});
