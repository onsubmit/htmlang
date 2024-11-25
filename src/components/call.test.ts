import { ElementGraph } from '../elementGraph';

describe('call', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should expand variables before calling', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <function- add-two(="num" )>
        <const- sum="{num} + 2"></const->
        <console- log(="{num} + 2 = {sum}" )></console->
      </function->

      <const- n="5"></const->
      <call- add-two(="{n}")></call->
    `;

    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('5 + 2 = 7');
  });

  it('should throw if function name is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <function- add-two(="num" )>
        <const- sum="{num} + 2"></const->
        <console- log(="{num} + 2 = {sum}" )></console->
      </function->

      <call-></call->
    `;

    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Missing function name');
  });

  it('should throw if function cannot be found', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <call- add-two(="5")></call->
    `;

    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Function named add-two not found in this scope.');
  });
});
