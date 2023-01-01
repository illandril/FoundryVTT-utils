let Module: typeof import('./Module').default;
let Logger: jest.SpiedClass<typeof import('./Logger').default>;
let mockSavedValue: typeof import('./tests/setup/game/settings').mockSavedValue;

beforeEach(async () => {
  Module = (await import('./Module')).default;
  mockSavedValue = (await import('./tests/setup/game/settings')).mockSavedValue;
  const loggerModule = await import('./Logger');
  Logger = jest.spyOn(loggerModule, 'default').mockImplementation(function MockLogger(this: import('./Logger').default) {
    this.info = jest.fn();
    return this;
  });

  jest.resetModules();
});

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
    expect(Logger).toBeCalledWith(`${title} v${version}`, { debug: false }, undefined);
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

  it('initializes logLevel.debug to false if no saved value', () => {
    mockSavedValue('example-module', 'debug', undefined);

    const module = new Module({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    const logger = module.logger;
    expect(logger).toBe(Logger.mock.instances.slice(-1)[0]);
    const logLevel = Logger.mock.lastCall?.[1];

    expect(logLevel?.debug).toBe(false);

    Hooks.callAll('init');

    expect(logLevel?.debug).toBe(false);
  });

  it.each([true, false])('initializes logLevel.debug with the saved value (%j)', (savedValue) => {
    mockSavedValue('example-module', 'debug', savedValue);

    const module = new Module({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    const logger = module.logger;
    expect(logger).toBe(Logger.mock.instances.slice(-1)[0]);
    const logLevel = Logger.mock.lastCall?.[1];

    expect(logLevel?.debug).toBe(false);

    Hooks.callAll('init');

    expect(logLevel?.debug).toBe(savedValue);
  });

  it('updates logLevel.debug when debug setting changes', () => {
    const module = new Module({
      id: 'example-module',
      title: 'Example Module',
      version: '1.0.0',
    });

    const logger = module.logger;
    expect(logger).toBe(Logger.mock.instances.slice(-1)[0]);
    const logLevel = Logger.mock.lastCall?.[1];

    Hooks.callAll('init');

    game.settings.set('example-module', 'debug', true);

    expect(logLevel?.debug).toBe(true);

    game.settings.set('example-module', 'debug', false);

    expect(logLevel?.debug).toBe(false);

    game.settings.set('example-module', 'debug', true);

    expect(logLevel?.debug).toBe(true);
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
    expect(Logger).toBeCalledWith('Example Module v1.0.0', { debug: false }, color);
    expect(logger).toBeInstanceOf(Logger);
  });
});
