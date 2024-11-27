import { ElementGraph } from '../elementGraph';

describe('throw', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Should throw', () => {
    const container = document.createElement('div');
    container.innerHTML = `
       <throw- (="Hi Andy" )></throw->
    `;
    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Hi Andy');
  });

  it('Should find corresponding <try-> block', () => {
    const spy = vi.spyOn(console, 'log');

    const container = document.createElement('div');
    container.innerHTML = `
      <try->
        <scope->
          <const- i="5"></const->
          <throw- (="{i}" )></throw->
        </scope->
      </try->
      <catch- (="e" )>
        <console- log(="{e}" )></console->
      </catch->
    `;
    document.body.appendChild(container);
    ElementGraph.build().execute();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, '5');
  });
});
