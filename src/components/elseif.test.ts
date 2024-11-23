import { traverseDomTree } from '../main';

describe('elseif', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should expand variables', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="1"></const ->
      <if- (="1 === 2" )>
        <console- log(="nope" )></console->
      </if->
      <else-if- (="{i} + {i} === 2" )>
        <console- log(="math is math" )></console->
      </else-if->
    `;
    document.body.appendChild(container);
    traverseDomTree();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('math is math');
  });

  it('should throw if condition is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="1 === 2" )>
        <console- log(="nope" )></console->
      </if->
      <else-if- (="")>
        <console- log(="missing" )></console->
      </else-if->
    `;
    document.body.appendChild(container);
    expect(traverseDomTree).toThrow('No condition found');
  });

  it('should throw if condition is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="1 === 2" )>
        <console- log(="nope" )></console->
      </if->
      <else-if->
        <console- log(="missing" )></console->
      </else-if->
    `;
    document.body.appendChild(container);
    expect(traverseDomTree).toThrow('No condition found');
  });
});
