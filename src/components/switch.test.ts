import { ElementGraph } from '../elementGraph';

describe('switch', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should switch a simple statement', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <function- is-prime(="num" )>
        <switch- (="{num}" )>
          <case- (="0" )>
            <console- log(="{num}: fallthrough" )></console->
          </case->
          <case- (="1" )>
            <console- log(="{num}: not prime" )></console->
            <break->
          </case->
          <case- (="2" )>
            <console- log(="{num}: prime!" )></console->
            <break-></break->
          </case->
          <default->
            <console- log(="{num}: 🤷‍♂️" )></console->
          </default->
        </switch->
      </function->

      <call- is-prime(="0" )></call->
      <call- is-prime(="1" )></call->
      <call- is-prime(="2" )></call->
      <call- is-prime(="3" )></call->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenNthCalledWith(1, '0: fallthrough');
    expect(spy).toHaveBeenNthCalledWith(2, '0: not prime');
    expect(spy).toHaveBeenNthCalledWith(3, '1: not prime');
    expect(spy).toHaveBeenNthCalledWith(4, '2: prime!');
    expect(spy).toHaveBeenNthCalledWith(5, '3: 🤷‍♂️');
  });

  it('should throw when default case is not last', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <switch- (="{num}" )>
        <case- (="0" )>
          <console- log(="0" )></console->
          <break-></break->
        </case->
        <default->
          <console- log(="unknown" )></console->
        </default->
        <case- (="1" )>
          <console- log(="1" )></console->
          <break-></break->
        </case->
      </switch->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('default case must be the last case');
  });

  it('should throw if multiple default cases exists', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <switch- (="{num}" )>
        <case- (="0" )>
          <console- log(="0" )></console->
          <break-></break->
        </case->
        <default->
          <console- log(="unknown1" )></console->
        </default->
        <default->
          <console- log(="unknown2" )></console->
        </default->
      </switch->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow(
      'switch statement cannot have more than one default case',
    );
  });

  it('should throw if switch condition is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <switch->
        <case- (="0" )>
          <console- log(="0" )></console->
          <break-></break->
        </case->
      </switch->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('No condition found');
  });

  it('should throw if case condition is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <switch- (="{num}" )>
        <case->
          <console- log(="0" )></console->
          <break-></break->
        </case->
      </switch->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('No condition found');
  });
});
