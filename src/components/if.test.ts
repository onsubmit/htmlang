import { getByText, queryByText } from '@testing-library/dom';

import { ElementGraph } from '../elementGraph';
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
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('math is math');
  });

  it('should conditionally render a non-HtmlangElement', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="1"></const->
      <if- (="{i} + 1 === 2" )>
        <p>Yep, {i} + 1 === 2!</p>
      </if->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(getByText(container, 'Yep, 1 + 1 === 2!')).toBeInTheDocument();
  });

  it('should expand variables', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="1"></const->
      <if- (="{i} + {i} === 2" )>
        <console- log(="math is math" )></console->
      </if->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('math is math');
  });

  it('should throw if condition is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <if- (="" )>
        <console- log(="hamburgers" )></console->
      </if->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('No condition found');
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
    ElementGraph.build().execute();

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
    ElementGraph.build().execute();

    expect(spy).not.toHaveBeenCalled();
    expect(queryByText(container, 'Hi there')).not.toBeInTheDocument();

    const ifElement = container.querySelector<IfDash>('if-')!;
    ifElement.setAttribute('(', '1 + 1 === 2');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'math is math');
    expect(getByText(container, 'Hi there')).toBeInTheDocument();
  });
});
