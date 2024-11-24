import { getByText, queryByText } from '@testing-library/dom';

import { ElementGraph } from '../elementGraph';
import { ElseIfDash } from './elseIf';

describe('elseif', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should execute an else-if', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="4"></const->
      <if- (="{i} < 2" )>
        <console- log(="{i} is small" )></console->
      </if->
      <else-if- (="{i} < 5")>
        <console- log(="{i} is medium" )></console->
      </else-if->
      <else-if- (="{i} < 10")>
        <console- log(="{i} is medium-large" )></console->
      </else-if->
      <else->
        <console- log(="{i} is large" )></console->
      </else->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('4 is medium');
  });

  it('should expand variables', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="1"></const->
      <if- (="1 === 2" )>
        <console- log(="nope" )></console->
      </if->
      <else-if- (="{i} + {i} === 2" )>
        <console- log(="math is math" )></console->
      </else-if->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

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
    expect(ElementGraph.build().execute).toThrow('No condition found');
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
    expect(ElementGraph.build().execute).toThrow('No condition found');
  });

  it('should reevaluate reactively (true -> false)', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="1 + 1 === 3" )>
        <p>if block</p>
        <console- log(="if-" )></console->
      </if->
      <else-if- (="1 + 1 === 2")>
        <p>else-if block</p>
        <console- log(="else-if-" )></console->
      </else-if->
      <else->
        <p>else block</p>
        <console- log(="else-" )></console->
      </else->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'else-if-');
    expect(queryByText(container, 'if block')).not.toBeInTheDocument();
    expect(getByText(container, 'else-if block')).toBeInTheDocument();
    expect(queryByText(container, 'else block')).not.toBeInTheDocument();

    const elseIfElement = container.querySelector<ElseIfDash>('else-if-')!;
    elseIfElement.setAttribute('(', '1 + 1 === 4');

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, 'else-');
    expect(queryByText(container, 'if block')).not.toBeInTheDocument();
    expect(queryByText(container, 'else-if block')).not.toBeInTheDocument();
    expect(getByText(container, 'else block')).toBeInTheDocument();
  });

  it('should reevaluate reactively (false -> true)', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="1 + 1 === 3" )>
        <p>if block</p>
        <console- log(="if-" )></console->
      </if->
      <else-if- (="1 + 1 === 4")>
        <p>else-if block 1</p>
        <console- log(="else-if-1" )></console->
      </else-if->
      <else-if- (="1 + 1 === 5") id="target">
        <p>else-if block 2</p>
        <console- log(="else-if-2" )></console->
      </else-if->
      <else->
        <p>else block</p>
        <console- log(="else-" )></console->
      </else->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'else-');
    expect(queryByText(container, 'if block')).not.toBeInTheDocument();
    expect(queryByText(container, 'else-if block 1')).not.toBeInTheDocument();
    expect(queryByText(container, 'else-if block 2')).not.toBeInTheDocument();
    expect(getByText(container, 'else block')).toBeInTheDocument();

    const elseIfElement = container.querySelector<ElseIfDash>('#target')!;
    elseIfElement.setAttribute('(', '1 + 1 === 2');

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, 'else-if-2');
    expect(queryByText(container, 'if block')).not.toBeInTheDocument();
    expect(queryByText(container, 'else-if block 1')).not.toBeInTheDocument();
    expect(getByText(container, 'else-if block 2')).toBeInTheDocument();
    expect(queryByText(container, 'else block')).not.toBeInTheDocument();
  });
});
