import { ElementGraph } from '../elementGraph';

describe('return', () => {
  it('should throw if function is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <return->5</return->
    `;

    document.body.appendChild(container);
    expect(ElementGraph.build().execute).toThrow('Return statement has no corresponding function.');
  });
});
