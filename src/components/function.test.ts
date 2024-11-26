import { getByTestId, getByText } from '@testing-library/dom';

import { ElementGraph } from '../elementGraph';

describe('function', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should FizzBuzz correctly', () => {
    const spy = vi.spyOn(console, 'log');

    function fizzBuzz(num: number): string {
      if (num % 15 === 0) return `${num}: FizzBuzz`;
      if (num % 3 === 0) return `${num}: Fizz`;
      if (num % 5 === 0) return `${num}: Buzz`;
      return `${num}`;
    }

    const max = 18;
    const container = document.createElement('div');
    container.innerHTML = `
      <function- fizz-buzz(="num" )>
        <if- (="{num} % 15 === 0" )>
          <console- log(="{num}: FizzBuzz" )></console->
        </if->
        <else-if- (="{num} % 3 === 0" )>
          <console- log(="{num}: Fizz" )></console->
        </else-if->
        <else-if- (="{num} % 5 === 0" )>
          <console- log(="{num}: Buzz" )></console->
        </else-if->
        <else->
          <console- log(="{num}" )></console->
        </else->
      </function->

      <for- (="i of [...Array(${max}).keys()];" )>
        <call- fizz-buzz(="{i}" )></call->
      </for->
    `;

    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(max);
    for (const num of [...Array(max).keys()]) {
      expect(spy).toHaveBeenNthCalledWith(num + 1, fizzBuzz(num));
    }
  });

  it('should support non-HtmlangElements', () => {
    const container = document.createElement('div');
    container.innerHTML = `
    <function- func-name(="a, b, c" )>
      <const- sum="{a} + {b} + {c}"></const->
      <p>{a} + {b} + {c}</p>
      <p>{sum}</p>
    </function->

    <call- func-name(="1, 2, 3" ) data-testid="call1"></call->
    <call- func-name(="'a', 'b', 'c'" ) data-testid="call2"></call->
    `;

    document.body.appendChild(container);
    ElementGraph.build().execute();

    const call1 = getByTestId(container, 'call1');
    const call2 = getByTestId(container, 'call2');
    expect(container).toContainElement(call1);
    expect(container).toContainElement(call2);

    expect(getByText(call1, '1 + 2 + 3')).toBeInTheDocument();
    expect(getByText(call1, '6')).toBeInTheDocument();

    expect(getByText(call2, 'a + b + c')).toBeInTheDocument();
    expect(getByText(call2, 'abc')).toBeInTheDocument();
  });

  it('should not require parentheses', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <function- go>
        <console- log(="Hello world" )></console->
      </function->

      <call- go></call->
    `;

    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Hello world');
  });

  it('should call a function during a declaration', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <function- add-two(="num" )>
        <return->{num} + 2</return->
      </function->

      <const- n="5"></const->
      <const- value="add-two({n})"></const->
      <console- log(="{n} + 2 = {value}" )></console->
    `;

    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('5 + 2 = 7');
  });

  it('should throw if function name is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <function->
        <console- log(="Hello world" )></console->
      </function->
    `;

    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow(
      'Could not find function name attribute from: <function- style="display: none;"></function->"',
    );
  });

  it('should throw if function is already declared', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <function- add-two(="num" )>
        <return->{num} + 2</return->
      </function->
      <function- add-two(="num" )>
        <return->{num} + 2</return->
      </function->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow(
      'Function add-two is already defined in this scope.',
    );
  });
});
