import CSSPrefix from './CSSPrefix';
import Module from './Module';

jest.mock('./CSSPrefix');

describe('cssPrefix', () => {
  it('lazily creates cssPrefix', () => {
    const module = new Module({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    expect(CSSPrefix).not.toBeCalled();

    const prefix = module.cssPrefix;

    expect(CSSPrefix).toBeCalledTimes(1);
    expect(prefix).toBeInstanceOf(CSSPrefix);
  });

  it('does not re-create cssPrefix', () => {
    const module = new Module({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    expect(CSSPrefix).not.toBeCalled();

    const prefix = module.cssPrefix;
    const prefix2 = module.cssPrefix;

    expect(CSSPrefix).toBeCalledTimes(1);
    expect(prefix).toBeInstanceOf(CSSPrefix);
    expect(prefix).toBe(prefix2);
  });

  it.each([
    'example-module',
    'illandril-chat-enhancements',
    'illandril-token-tooltips',
  ])('passes module id (%s) to CSSPrefix', (id) => {
    const module = new Module({
      id,
      title: 'Example Module',
      version: '1.0.0',
    });
    const prefix = module.cssPrefix;

    expect(CSSPrefix).toBeCalledTimes(1);
    expect(CSSPrefix).toBeCalledWith(id);
    expect(prefix).toBeInstanceOf(CSSPrefix);
  });
});

describe('localize', () => {
  const localizeSpy = jest.spyOn(game.i18n, 'localize');
  const formatSpy = jest.spyOn(game.i18n, 'format');

  it('calls game.i18n.localize with no data', () => {
    const module = new Module({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    expect(localizeSpy).not.toBeCalled();
    localizeSpy.mockReturnValueOnce('The localized string');

    const value = module.localize('test.string');

    expect(value).toBe('The localized string');
    expect(localizeSpy).toBeCalledWith('example-module.test.string');
    expect(formatSpy).not.toBeCalled();
  });

  it('calls game.i18n.format with data', () => {
    const module = new Module({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    expect(formatSpy).not.toBeCalled();
    formatSpy.mockReturnValueOnce('The localized string');

    const value = module.localize('test.string', { data: 'value' });

    expect(value).toBe('The localized string');
    expect(formatSpy).toBeCalledWith('example-module.test.string', { data: 'value' });
    expect(localizeSpy).not.toBeCalled();
  });
});
