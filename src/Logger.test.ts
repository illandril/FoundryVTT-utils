import Logger from './Logger';

const methods = ['debug', 'info', 'warn', 'error'] as const;

const testModuleNames = ['Example Module', "Illandril's Chat Enhancements", "Illandril's Token Toolitps"] as const;

const testColors = ['#000', '#4f0104', 'rebeccapurple', 'rgb(90,0,0)'];

const logLevel = {
  debug: true,
};

beforeEach(() => {
  logLevel.debug = true;
});

describe.each(methods)('%s', (testedMethodName) => {
  let targetConsoleSpy: jest.SpyInstance<void, unknown[]>;

  beforeEach(() => {
    targetConsoleSpy = jest.spyOn(console, testedMethodName).mockImplementation(() => undefined);
    for (const methodName of methods) {
      if (methodName === testedMethodName) {
        continue;
      }
      jest.spyOn(console, methodName).mockImplementation(() => {
        throw new Error(`${methodName} called unexpectedly`);
      });
    }
  });

  it.each([
    [['Message']],
    [[{ key: 'value', key2: 'value2' }]],
    [[new Error('This is an error')]],
    [['Message 1', 'Message 2', 'Message 3']],
  ] as (string | object)[][][])('passes the data to console (%j)', (data) => {
    const logger = new Logger('Example Module', logLevel);
    logger[testedMethodName](...data);
    expect(targetConsoleSpy).toHaveBeenCalledWith(
      '%cExample Module',
      expect.stringContaining('background-color'),
      ...data,
    );
  });

  it('respects logLevel.debug', () => {
    const logger = new Logger('Example Module', logLevel);

    logger[testedMethodName]('Message');

    expect(targetConsoleSpy).toHaveBeenCalledTimes(1);

    logLevel.debug = false;
    logger[testedMethodName]('Message');

    if (testedMethodName === 'debug') {
      expect(targetConsoleSpy).toHaveBeenCalledTimes(1);
    } else {
      expect(targetConsoleSpy).toHaveBeenCalledTimes(2);
    }

    logLevel.debug = true;
    logger[testedMethodName]('Message');

    if (testedMethodName === 'debug') {
      expect(targetConsoleSpy).toHaveBeenCalledTimes(2);
    } else {
      expect(targetConsoleSpy).toHaveBeenCalledTimes(3);
    }
  });

  it.each(testModuleNames)('outputs module name (%s)', (moduleName) => {
    const logger = new Logger(moduleName, logLevel);
    logger[testedMethodName]('Message');
    expect(targetConsoleSpy).toHaveBeenCalledWith(
      `%c${moduleName}`,
      expect.stringContaining('background-color'),
      'Message',
    );
  });

  it.each(testColors)('styles the name (%s)', (color) => {
    const logger = new Logger('Example Module', logLevel, color);
    logger[testedMethodName]('Message');
    expect(targetConsoleSpy).toHaveBeenCalledWith(
      '%cExample Module',
      `background-color: ${color}; color: #fff; padding: 0.1em 0.5em;`,
      'Message',
    );
  });

  it('defaults color to #4f0104', () => {
    const logger = new Logger('Example Module', logLevel);
    logger[testedMethodName]('Message');
    expect(targetConsoleSpy).toHaveBeenCalledWith(
      '%cExample Module',
      'background-color: #4f0104; color: #fff; padding: 0.1em 0.5em;',
      'Message',
    );
  });
});

describe('child', () => {
  const parentLogger = new Logger('Example Module', logLevel, 'rebeccapurple');

  describe('inherits parent color if unspecified', () => {
    const childLogger = parentLogger.child('Child');

    it.each(methods)('%s', (testedMethodName) => {
      const targetConsoleSpy = jest.spyOn(console, testedMethodName);
      targetConsoleSpy.mockImplementation(() => undefined);
      for (const methodName of methods) {
        if (methodName === testedMethodName) {
          continue;
        }
        jest.spyOn(console, methodName).mockImplementation(() => {
          throw new Error(`${methodName} called unexpectedly`);
        });
      }
      childLogger[testedMethodName]('Message');
      expect(targetConsoleSpy).toHaveBeenCalledWith(
        '%cExample Module - Child',
        'background-color: rebeccapurple; color: #fff; padding: 0.1em 0.5em;',
        'Message',
      );
    });
  });

  describe('respects logLevel.debug from parent logger', () => {
    const childLogger = parentLogger.child('Child');

    it.each(methods)('%s', (testedMethodName) => {
      const targetConsoleSpy = jest.spyOn(console, testedMethodName);
      targetConsoleSpy.mockImplementation(() => undefined);
      for (const methodName of methods) {
        if (methodName === testedMethodName) {
          continue;
        }
        jest.spyOn(console, methodName).mockImplementation(() => {
          throw new Error(`${methodName} called unexpectedly`);
        });
      }

      childLogger[testedMethodName]('Message');

      expect(targetConsoleSpy).toHaveBeenCalledTimes(1);

      logLevel.debug = false;
      childLogger[testedMethodName]('Message');

      if (testedMethodName === 'debug') {
        expect(targetConsoleSpy).toHaveBeenCalledTimes(1);
      } else {
        expect(targetConsoleSpy).toHaveBeenCalledTimes(2);
      }

      logLevel.debug = true;
      childLogger[testedMethodName]('Message');

      if (testedMethodName === 'debug') {
        expect(targetConsoleSpy).toHaveBeenCalledTimes(2);
      } else {
        expect(targetConsoleSpy).toHaveBeenCalledTimes(3);
      }
    });
  });

  describe.each(testColors)('uses specified color (%s)', (testColor) => {
    const childLogger = parentLogger.child('Child', testColor);

    it.each(methods)('%s', (testedMethodName) => {
      const targetConsoleSpy = jest.spyOn(console, testedMethodName);
      targetConsoleSpy.mockImplementation(() => undefined);
      for (const methodName of methods) {
        if (methodName === testedMethodName) {
          continue;
        }
        jest.spyOn(console, methodName).mockImplementation(() => {
          throw new Error(`${methodName} called unexpectedly`);
        });
      }
      childLogger[testedMethodName]('Message');
      expect(targetConsoleSpy).toHaveBeenCalledWith(
        '%cExample Module - Child',
        `background-color: ${testColor}; color: #fff; padding: 0.1em 0.5em;`,
        'Message',
      );
    });
  });

  describe.each(['Custom Options', 'Tooltip'])('uses specified name (%s)', (name) => {
    const childLogger = parentLogger.child(name);

    it.each(methods)('%s', (testedMethodName) => {
      const targetConsoleSpy = jest.spyOn(console, testedMethodName);
      targetConsoleSpy.mockImplementation(() => undefined);
      for (const methodName of methods) {
        if (methodName === testedMethodName) {
          continue;
        }
        jest.spyOn(console, methodName).mockImplementation(() => {
          throw new Error(`${methodName} called unexpectedly`);
        });
      }
      childLogger[testedMethodName]('Message');
      expect(targetConsoleSpy).toHaveBeenCalledWith(
        `%cExample Module - ${name}`,
        expect.stringContaining('background-color'),
        'Message',
      );
    });
  });
});
