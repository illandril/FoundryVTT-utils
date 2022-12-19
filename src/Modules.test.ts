import CSSPrefix from './CSSPrefix';
import Logger from './Logger';
import Module from './Module';

jest.mock('./CSSPrefix');
jest.mock('./Logger');

describe('logger', () => {
  it.each([
    ['Example Module', '1.0.0'],
    ['Example Module', '1.2.3'],
    ['Example Module', '3.0.1'],
    ['Illandril\'s Chat Enhancements', '1.0.0'],
    ['Illandril\'s Token Tooltips', '1.0.0'],
  ])('passes module title and version (%s, %s) to Logger', (title, version) => {
    const module = new Module({ id: 'example-module', title, version });
    const logger = module.logger;

    expect(Logger).toBeCalledTimes(1);
    expect(Logger).toBeCalledWith(`${title} v${version}`, undefined);
    expect(logger).toBeInstanceOf(Logger);
  });

  it('logs "Started" with no bugs URL', () => {
    const module = new Module({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    const logger = module.logger;
    expect(logger.info).toBeCalledWith('Started');
  });

  it.each([
    'https://www.example.com',
    'https://github.com/illandril/FoundryVTT-chat-enhancements/issues',
  ])('logs "Started" with the provided bugs URL (%s)', (bugsURL) => {
    const module = new Module({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
      bugs: bugsURL,
    });

    const logger = module.logger;
    expect(logger.info).toBeCalledWith(`Started. To report bugs, go to: ${bugsURL}`);
  });

  it.each([
    '#000',
    '#4f0104',
    'rebeccapurple',
  ])('passes color (%s) to Logger', (color) => {
    const module = new Module({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
      color,
    });
    const logger = module.logger;

    expect(Logger).toBeCalledTimes(1);
    expect(Logger).toBeCalledWith('Example Module v1.0.0', color);
    expect(logger).toBeInstanceOf(Logger);
  });
});

describe('cssPrefix', () => {
  it('lazily creats cssPrefix', () => {
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
