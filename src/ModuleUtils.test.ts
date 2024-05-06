import CSSPrefix from './CSSPrefix';
import ModuleSocket from './ModuleSocket';
import ModuleUtils from './ModuleUtils';

jest.mock('./CSSPrefix');
jest.mock('./ModuleSocket');

describe('cssPrefix', () => {
  it('lazily creates cssPrefix', () => {
    const module = new ModuleUtils({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    expect(CSSPrefix).not.toHaveBeenCalled();

    const prefix = module.cssPrefix;

    expect(CSSPrefix).toHaveBeenCalledTimes(1);
    expect(prefix).toBeInstanceOf(CSSPrefix);
  });

  it('does not re-create cssPrefix', () => {
    const module = new ModuleUtils({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    expect(CSSPrefix).not.toHaveBeenCalled();

    const prefix = module.cssPrefix;
    const prefix2 = module.cssPrefix;

    expect(CSSPrefix).toHaveBeenCalledTimes(1);
    expect(prefix).toBeInstanceOf(CSSPrefix);
    expect(prefix).toBe(prefix2);
  });

  it.each(['example-module', 'illandril-chat-enhancements', 'illandril-token-tooltips'])(
    'passes module id (%s) to CSSPrefix',
    (id) => {
      const module = new ModuleUtils({
        id,
        title: 'Example Module',
        version: '1.0.0',
      });
      const prefix = module.cssPrefix;

      expect(CSSPrefix).toHaveBeenCalledTimes(1);
      expect(CSSPrefix).toHaveBeenCalledWith(id);
      expect(prefix).toBeInstanceOf(CSSPrefix);
    },
  );
});

describe('id', () => {
  it.each(['example-module', 'illandril-chat-enhancements', 'illandril-token-tooltips'])(
    'uses module id (%s)',
    (id) => {
      const module = new ModuleUtils({
        id,
        title: 'Example Module',
        version: '1.0.0',
      });
      expect(module.id).toBe(id);
    },
  );
});

describe('localize', () => {
  const localizeSpy = jest.spyOn(game.i18n, 'localize');
  const formatSpy = jest.spyOn(game.i18n, 'format');
  const hasSpy = jest.spyOn(game.i18n, 'has');

  it('calls game.i18n.localize with no data', () => {
    const module = new ModuleUtils({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    expect(localizeSpy).not.toHaveBeenCalled();
    localizeSpy.mockReturnValueOnce('The localized string');

    const value = module.localize('test.string');

    expect(value).toBe('The localized string');
    expect(localizeSpy).toHaveBeenCalledWith('example-module.test.string');
    expect(formatSpy).not.toHaveBeenCalled();
    expect(hasSpy).not.toHaveBeenCalled();
  });

  it('calls game.i18n.format with data', () => {
    const module = new ModuleUtils({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    expect(formatSpy).not.toHaveBeenCalled();
    formatSpy.mockReturnValueOnce('The localized string');

    const value = module.localize('test.string', { data: 'value' });

    expect(value).toBe('The localized string');
    expect(formatSpy).toHaveBeenCalledWith('example-module.test.string', { data: 'value' });
    expect(localizeSpy).not.toHaveBeenCalled();
    expect(hasSpy).not.toHaveBeenCalled();
  });

  it('returns undefined for missing optional strings', () => {
    const module = new ModuleUtils({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    localizeSpy.mockReturnValueOnce('The localized string');
    hasSpy.mockReturnValueOnce(false);

    const value = module.localize('test.string', undefined, true);

    expect(value).toBeUndefined();
    expect(hasSpy).toHaveBeenCalledWith('example-module.test.string');
    expect(localizeSpy).not.toHaveBeenCalled();
    expect(formatSpy).not.toHaveBeenCalled();
  });

  it('returns value for existing optional strings', () => {
    const module = new ModuleUtils({ id: 'example-module', title: 'Example Module', version: '1.0.0' });

    localizeSpy.mockReturnValueOnce('The localized string');
    hasSpy.mockReturnValueOnce(true);

    const value = module.localize('test.string', undefined, true);

    expect(value).toBe('The localized string');
    expect(hasSpy).toHaveBeenCalledWith('example-module.test.string');
    expect(localizeSpy).toHaveBeenCalledWith('example-module.test.string');
    expect(formatSpy).not.toHaveBeenCalled();
  });
});

describe('initializeSocket()', () => {
  it('creates a ModuleSocket instance', () => {
    const module = new ModuleUtils({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    expect(ModuleSocket).not.toHaveBeenCalled();

    const socket = module.initializeSocket();

    expect(ModuleSocket).toHaveBeenCalledTimes(1);
    expect(socket).toBeInstanceOf(ModuleSocket);
  });

  it('errors if trying to initialize twice', () => {
    const module = new ModuleUtils({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    expect(ModuleSocket).not.toHaveBeenCalled();

    module.initializeSocket();

    expect(() => {
      module.initializeSocket();
    }).toThrow(/^Socket should only be initialized once \(to ensure/);

    expect(ModuleSocket).toHaveBeenCalledTimes(1);
  });

  it.each(['example-module', 'illandril-chat-enhancements', 'illandril-token-tooltips'])(
    'passes module id (%s) to ModuleSocket',
    (id) => {
      const module = new ModuleUtils({
        id,
        title: 'Example Module',
        version: '1.0.0',
      });
      const socket = module.initializeSocket();

      expect(ModuleSocket).toHaveBeenCalledTimes(1);
      expect(ModuleSocket).toHaveBeenCalledWith(id);
      expect(socket).toBeInstanceOf(ModuleSocket);
    },
  );
});
