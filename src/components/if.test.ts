import { getByText, queryByText } from '@testing-library/dom';

import { traverseDomTree } from '../main';
import { IfDash } from './if';

describe('if', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should conditionally render', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="1 + 1 === 2" )>
        <console- log(="math is math" )></console->
      </if->
    `;
    document.body.appendChild(container);
    traverseDomTree();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('math is math');
  });

  it('should expand variables', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="1"></const ->
      <if- (="{i} + {i} === 2" )>
        <console- log(="math is math" )></console->
      </if->
    `;
    document.body.appendChild(container);
    traverseDomTree();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('math is math');
  });

  it('should support else-if and else statements', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="20"></const->
      <if- (="{i} < 2" )>
        <console- log(="{i} is small" )></console->
      </if->
      <else-if- (="{i} < 5")>
        <console- log(="{i} is medium" )></console->
      </else-if->
      <else->
        <console- log(="{i} is large" )></console->
      </else->

    `;
    document.body.appendChild(container);
    traverseDomTree();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('20 is large');
  });

  it('should throw is condition is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="" )>
        <console- log(="hamburgers" )></console->
      </if->
    `;
    document.body.appendChild(container);
    expect(traverseDomTree).toThrow('No condition found');
  });

  it('should reevaluate reactively (true -> false)', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="1 + 1 === 2" )>
        <p>Hi there</p>
        <console- log(="math is math" )></console->
      </if->
    `;
    document.body.appendChild(container);
    traverseDomTree();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'math is math');
    expect(getByText(container, 'Hi there')).toBeInTheDocument();

    const ifElement = container.querySelector<IfDash>('if-')!;
    ifElement.setAttribute('(', '1 + 1 === 3');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(queryByText(container, 'Hi there')).not.toBeInTheDocument();
  });

  it('should reevaluate reactively (false -> true)', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="1 + 1 === 3" )>
        <p>Hi there</p>
        <console- log(="math is math" )></console->
      </if->
    `;
    document.body.appendChild(container);
    traverseDomTree();

    expect(spy).not.toHaveBeenCalled();
    expect(queryByText(container, 'Hi there')).not.toBeInTheDocument();

    const ifElement = container.querySelector<IfDash>('if-')!;
    ifElement.setAttribute('(', '1 + 1 === 2');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'math is math');
    expect(getByText(container, 'Hi there')).toBeInTheDocument();
  });
});
