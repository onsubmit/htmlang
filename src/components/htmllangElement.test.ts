import { BaseHtmlangElement } from './htmlangElement';

describe('htmlangElement', () => {
  it('throws when using a BaseHtmlangElement instance', () => {
    expect(BaseHtmlangElement.getTagName).toThrow('Tag name not set');
    expect(() => new BaseHtmlangElement()).toThrow(
      'Invalid constructor, the constructor is not part of the custom element registry',
    );
    customElements.define('htmlang-element', BaseHtmlangElement);
    expect(new BaseHtmlangElement().execute).toThrow('Method not implemented.');
  });
});
