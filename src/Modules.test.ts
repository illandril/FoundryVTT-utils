import CSSPrefix from './CSSPrefix';
import Logger from './Logger';
import Module from './Module';

jest.mock('./CSSPrefix');
jest.mock('./Logger');


describe('logger', () => {
  it.each([
    'Example Module',
    'Illandril\'s Chat Enhancements',
    'Illandril\'s Token Tooltips',
  ])('passes module name (%s) to Logger', (name) => {
    const module = new Module('example-module', name);
    const logger = module.logger;

    expect(Logger).toBeCalledTimes(1);
    expect(Logger).toBeCalledWith(name, undefined);
    expect(logger).toBeInstanceOf(Logger);
  });

  it.each([
    '#000',
    '#4f0104',
    'rebeccapurple',
  ])('passes color (%s) to Logger', (color) => {
    const module = new Module('example-module', 'Example Module', { color });
    const logger = module.logger;

    expect(Logger).toBeCalledTimes(1);
    expect(Logger).toBeCalledWith('Example Module', color);
    expect(logger).toBeInstanceOf(Logger);
  });
});

describe('cssPrefix', () => {
  it('lazily creats cssPrefix', () => {
    const module = new Module('example-module', 'Example Module');

    expect(CSSPrefix).not.toBeCalled();

    const prefix = module.cssPrefix;

    expect(CSSPrefix).toBeCalledTimes(1);
    expect(prefix).toBeInstanceOf(CSSPrefix);
  });

  it.each([
    'example-module',
    'illandril-chat-enhancements',
    'illandril-token-tooltips',
  ])('passes module key (%s) to CSSPrefix', (key) => {
    const module = new Module(key, 'Example Module');
    const prefix = module.cssPrefix;

    expect(CSSPrefix).toBeCalledTimes(1);
    expect(CSSPrefix).toBeCalledWith(key);
    expect(prefix).toBeInstanceOf(CSSPrefix);
  });
});
