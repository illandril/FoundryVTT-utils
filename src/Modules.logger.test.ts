let Module: typeof import('./Module').default;
let Logger: jest.SpiedClass<typeof import('./Logger').default>;

beforeEach(async () => {
  Module = (await import('./Module')).default;
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

  it('updates logLevel.debug when debug setting changes', () => {
    const settingSpy: { value: boolean, onChange?: (value: boolean) => void } = {
      value: true,
      onChange: undefined,
    };
    const regSpy = jest.spyOn(game.settings, 'register').mockImplementation((module, key, { onChange }) => {
      if (module === 'example-module' && key === 'debug') {
        settingSpy.onChange = onChange as (value: boolean) => void;
      }
    });

    jest.spyOn(game.settings, 'get').mockImplementation((module, key) => {
      if (module === 'example-module' && key === 'debug') {
        return settingSpy.value as never;
      }
      throw new Error(`Unexpected setting ${module}.${key}`);
    });


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

    expect(regSpy).toBeCalled();

    expect(logLevel?.debug).toBe(true);

    settingSpy.value = false;
    settingSpy.onChange?.(false);

    expect(logLevel?.debug).toBe(false);
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
