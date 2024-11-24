import { ElementGraph } from '../elementGraph';

describe('console', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should call console.log()', async () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `<console- log(="Hello, world!" )></console->`;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Hello, world!');
  });

  it('should not call console.log() if attribute is empty', async () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `<console- log(="" )></console->`;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should expand variables before logging', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <const- i="2"></const->
      <console- log(="{i} should be 2" )></console->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('2 should be 2');
  });

  it('should log undefined variables', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <console- log(="{i} should be undefined" )></console->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('undefined should be undefined');
  });
});
