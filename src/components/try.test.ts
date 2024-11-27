import { ElementGraph } from '../elementGraph';

describe('try', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should handle an exception', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <try->
        <console- log(="Throw?" )></console->
        <throw- (="'up 🤮'" )></throw->
        <console- log(="Good choice" )></console->
      </try->
      <catch- (="e" )>
        <console- log(="I threw {e}." )></console->
      </catch->
      <finally->
        <console- log(="Finally!" )></console->
      </finally->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 'Throw?');
    expect(spy).toHaveBeenNthCalledWith(2, 'I threw up 🤮.');
    expect(spy).toHaveBeenNthCalledWith(3, 'Finally!');
  });

  it('should rethrow if no catch block exists', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <try->
        <throw- (="'Rethrown'" )></throw->
      </try->
      <finally->
        <console- log(="Finally!" )></console->
      </finally->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Rethrown');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'Finally!');
  });

  it('should throw if multiple catch blocks exist', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <try->
        <throw- (="'up 🤮'" )></throw->
      </try->
      <catch- (="e" )>
        <console- log(="{e}" )></console->
      </catch->
      <catch- (="e" )>
        <console- log(="{e}" )></console->
      </catch->
      <finally->
        <console- log(="Finally!" )></console->
      </finally->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Only one <catch-> block is allowed.');
  });

  it('should throw if multiple finally blocks exist', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <try->
        <throw- (="'up 🤮'" )></throw->
      </try->
      <catch- (="e" )>
        <console- log(="{e}" )></console->
      </catch->
      <finally->
        <console- log(="Finally!" )></console->
      </finally->
      <finally->
        <console- log(="Finally again!" )></console->
      </finally->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Only one <finally-> block is allowed.');
  });

  it('should throw if no catch or finally block exists', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <try->
        <throw- (="'up 🤮'" )></throw->
      </try->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow(
      '<try-> block must have a <catch-> or <finally-> block, or both.',
    );
  });
});
