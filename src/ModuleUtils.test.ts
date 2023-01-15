import CSSPrefix from './CSSPrefix';
import ModuleUtils from './ModuleUtils';

jest.mock('./CSSPrefix');

describe('cssPrefix', () => {
  it('lazily creates cssPrefix', () => {
    const module = new ModuleUtils({
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
    const module = new ModuleUtils({
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
    const module = new ModuleUtils({
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
  const hasSpy = jest.spyOn(game.i18n, 'has');

  it('calls game.i18n.localize with no data', () => {
    const module = new ModuleUtils({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    expect(localizeSpy).not.toBeCalled();
    localizeSpy.mockReturnValueOnce('The localized string');

    const value = module.localize('test.string');

    expect(value).toBe('The localized string');
    expect(localizeSpy).toBeCalledWith('example-module.test.string');
    expect(formatSpy).not.toBeCalled();
    expect(hasSpy).not.toBeCalled();
  });

  it('calls game.i18n.format with data', () => {
    const module = new ModuleUtils({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    expect(formatSpy).not.toBeCalled();
    formatSpy.mockReturnValueOnce('The localized string');

    const value = module.localize('test.string', { data: 'value' });

    expect(value).toBe('The localized string');
    expect(formatSpy).toBeCalledWith('example-module.test.string', { data: 'value' });
    expect(localizeSpy).not.toBeCalled();
    expect(hasSpy).not.toBeCalled();
  });

  it('returns undefined for missing optional strings', () => {
    const module = new ModuleUtils({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    localizeSpy.mockReturnValueOnce('The localized string');
    hasSpy.mockReturnValueOnce(false);

    const value = module.localize('test.string', undefined, true);

    expect(value).toBeUndefined();
    expect(hasSpy).toBeCalledWith('example-module.test.string');
    expect(localizeSpy).not.toBeCalled();
    expect(formatSpy).not.toBeCalled();
  });

  it('returns value for existing optional strings', () => {
    const module = new ModuleUtils({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    localizeSpy.mockReturnValueOnce('The localized string');
    hasSpy.mockReturnValueOnce(true);

    const value = module.localize('test.string', undefined, true);

    expect(value).toBe('The localized string');
    expect(hasSpy).toBeCalledWith('example-module.test.string');
    expect(localizeSpy).toBeCalledWith('example-module.test.string');
    expect(formatSpy).not.toBeCalled();
  });
});
