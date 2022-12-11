import Logger from './Logger';

const methods = [
  'debug',
  'info',
  'warn',
  'error',
] as const;

const testModuleNames = [
  'Example Module',
  "Illandril's Chat Enhancements",
  "Illandril's Token Toolitps",
] as const;

const testColors = [
  '#000',
  '#4f0104',
  'rebeccapurple',
  'rgb(90,0,0)',
];

describe.each(methods)('%s', (testedMethodName) => {
  const targetConsoleSpy = jest.spyOn(console, testedMethodName);

  beforeAll(() => {
    targetConsoleSpy.mockImplementation(() => undefined);
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
    const logger = new Logger('Example Module');
    logger[testedMethodName](...data);
    expect(targetConsoleSpy).toBeCalledWith(`%cExample Module`,
      expect.stringContaining('background-color'), ...data);
  });

  it.each(testModuleNames)('outputs module name (%s)', (moduleName) => {
    const logger = new Logger(moduleName);
    logger[testedMethodName]('Message');
    expect(targetConsoleSpy).toBeCalledWith(`%c${moduleName}`,
      expect.stringContaining('background-color'), 'Message');
  });

  it.each(testColors)('styles the name (%s)', (color) => {
    const logger = new Logger('Example Module', color);
    logger[testedMethodName]('Message');
    expect(targetConsoleSpy).toBeCalledWith('%cExample Module',
      `background-color: ${color}; color: #fff; padding: 0.1em 0.5em;`, 'Message');
  });

  it('defaults color to #4f0104', () => {
    const logger = new Logger('Example Module');
    logger[testedMethodName]('Message');
    expect(targetConsoleSpy).toBeCalledWith('%cExample Module',
      `background-color: #4f0104; color: #fff; padding: 0.1em 0.5em;`, 'Message');
  });
});

describe('child', () => {
  const parentLogger = new Logger('Example Module', 'rebeccapurple');

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
      expect(targetConsoleSpy).toBeCalledWith(`%cExample Module - Child`,
        'background-color: rebeccapurple; color: #fff; padding: 0.1em 0.5em;', 'Message');
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
      expect(targetConsoleSpy).toBeCalledWith(`%cExample Module - Child`,
        `background-color: ${testColor}; color: #fff; padding: 0.1em 0.5em;`, 'Message');
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
      expect(targetConsoleSpy).toBeCalledWith(`%cExample Module - ${name}`,
        expect.stringContaining('background-color'), 'Message');
    });
  });
});
