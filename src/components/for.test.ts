import { ElementGraph } from '../elementGraph';
import { ForDash } from './for';

describe('for', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should loop over an array', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- bananas="'bananas'"></const->
      <const- fruits="['apples', 'oranges', {bananas}]"></const->
      <ul id="list">
      <for- (="fruit of {fruits}" )>
        <li>{fruit}</li>
        <console- log(="{fruit}" )></console->
      </for->
      </ul>
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 'apples');
    expect(spy).toHaveBeenNthCalledWith(2, 'oranges');
    expect(spy).toHaveBeenNthCalledWith(3, 'bananas');

    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
    expect([...items].map((li) => li.textContent)).toEqual(['apples', 'oranges', 'bananas']);
  });

  it('should reevaluate reactively', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <for- (="n of [1, 2, 3]" )>
        <console- log(="{n}" )></console->
      </for->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, '1');
    expect(spy).toHaveBeenNthCalledWith(2, '2');
    expect(spy).toHaveBeenNthCalledWith(3, '3');

    const forElement = container.querySelector<ForDash>('for-')!;
    forElement.setAttribute('(', 'n of [4, 5]');

    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenNthCalledWith(4, '4');
    expect(spy).toHaveBeenNthCalledWith(5, '5');
  });

  it('should throw when attribute cannot be parsed', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <for- (="foo" )>
        <console- log(="{item}" )></console->
      </for->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow(
      'Attribute must be of the form "<variable> of <array>". Found: foo',
    );
  });

  it('should throw when iterable is not an array', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <for- (="item of 123" )>
        <console- log(="{item}" )></console->
      </for->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow(
      'Could not parse iterable from the attribute: item of 123. Found: 123',
    );
  });
});
