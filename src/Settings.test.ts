const localize = jest.fn<string, [string]>();

let Settings: typeof import('./Settings').default;

beforeEach(() => import('./Settings').then((module) => {
  Settings = module.default;
  jest.resetModules();
  localize.mockImplementation((key: string) => key.endsWith('.label') ? 'Mock Label' : 'Mock Hint');
}));

describe('register', () => {
  const registerSpy = jest.spyOn(game.settings, 'register');

  describe('pre-initialized', () => {
    beforeEach(() => {
      Hooks.callAll('init');
    });

    describe('namespace', () => {
      it.each([
        'example-module',
        'illandril-chat-enhancements',
        'illandril-token-tooltips',
      ] as const)('passes namespace (%s) to game.settings.register', (namespace) => {
        const settings = new Settings(namespace, localize);
        settings.register('example', Boolean, false);

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith(namespace, 'example', expect.any(Object));
      });
    });

    describe('key', () => {
      it.each([
        'example',
        'example-boolean',
      ] as const)('passes key (%s) to game.settings.register and localize', (key) => {
        const settings = new Settings('example-module', localize);
        settings.register(key, Boolean, false);

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', key, expect.objectContaining({
          name: 'Mock Label',
        }));

        expect(localize).toBeCalledTimes(1);
        expect(localize).toBeCalledWith(`setting.${key}.label`);
      });
    });

    describe('type', () => {
      it('passes correct type for boolean settings', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example-boolean', Boolean, false);

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-boolean', expect.objectContaining({
          type: Boolean,
        }));
      });

      it('passes correct type for number settings', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example-number', Number, 0);

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-number', expect.objectContaining({
          type: Number,
        }));
      });

      it('passes correct type for string settings', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example-string', String, '');

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-string', expect.objectContaining({
          type: String,
        }));
      });

      it('passes correct type for object settings', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example-object', Object, {});

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-object', expect.objectContaining({
          type: Object,
        }));
      });
    });

    describe('default', () => {
      it.each([-1, 0, 1, 2, 3, 5, 8, 13])('passes correct default for number settings (%i)', (defaultValue) => {
        const settings = new Settings('example-module', localize);
        settings.register('example-number', Number, defaultValue);

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-number', expect.objectContaining({
          default: defaultValue,
        }));
      });
    });

    describe('hint', () => {
      it('includes a localized hint if hasHint is true', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, { hasHint: true });

        expect(localize).toBeCalledTimes(2);
        expect(localize).toBeCalledWith('setting.example.label');
        expect(localize).toBeCalledWith('setting.example.hint');

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          name: 'Mock Label',
          hint: 'Mock Hint',
        }));
      });

      it('does not include a hint if hasHint is false', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, { hasHint: false });

        expect(localize).toBeCalledTimes(1);
        expect(localize).toBeCalledWith('setting.example.label');

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          name: 'Mock Label',
          hint: undefined,
        }));
      });

      it('does not include a hint if hasHint not specified', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(localize).toBeCalledTimes(1);
        expect(localize).toBeCalledWith('setting.example.label');

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          name: 'Mock Label',
          hint: undefined,
        }));
      });
    });

    describe('scope', () => {
      it('defaults scope to world', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          scope: 'world',
        }));
      });

      it.each(['client', 'world'] as const)('passes scope (%s) to game.settings.register', (scope) => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, { scope });

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          scope,
        }));
      });
    });

    describe('config', () => {
      it('defaults config to true', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          config: true,
        }));
      });

      it.each([true, false])('passes config (%j) to game.settings.register', (config) => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, { config });

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          config,
        }));
      });
    });

    describe('requiresReload', () => {
      it('defaults requiresReload to false', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          requiresReload: false,
        }));
      });

      it.each([true, false])('passes requiresReload (%j) to game.settings.register', (requiresReload) => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, { requiresReload });

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          requiresReload,
        }));
      });
    });

    describe('onChange', () => {
      it('defaults onChange to undefined', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.any(Object));
        expect(registerSpy.mock.lastCall?.[2].onChange).toBeUndefined();
      });

      it('passes onChange to game.settings.register', () => {
        const onChange = () => undefined;
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, { onChange });

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          onChange,
        }));
      });

      it.each([true, false])('calls onChange with current value (%j) after init if callOnChangeOnInit=true', (currentValue) => {
        const getSpy = jest.spyOn(game.settings, 'get').mockImplementation((module, key) => {
          if (module === 'example-module' && key === 'example') {
            return currentValue as never;
          }
          throw new Error(`Unexpected setting ${module}.${key}`);
        });

        const onChange = jest.fn();
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, { onChange, callOnChangeOnInit: true });

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          onChange,
        }));
        expect(getSpy).toBeCalledTimes(1);
        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toBeCalledWith(currentValue);
      });

      it.each([false, undefined])('does not call onChange after init if callOnChangeOnInit=%j', (callOnChangeOnInit) => {
        const onChange = jest.fn();
        const settings = new Settings('example-module', localize);
        settings.register('example', Boolean, false, { onChange, callOnChangeOnInit });

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
          onChange,
        }));
        expect(onChange).not.toBeCalled();
      });
    });

    describe('choices', () => {
      it('defaults choices to undefined', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example-string', String, 'optionA', {});

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-string', expect.any(Object));
        expect(registerSpy.mock.lastCall?.[2]).not.toHaveProperty('choices');
      });

      it('passes choices to game.settings.register', () => {
        localize.mockImplementation((key) => `LOC[${key}]`);

        const choices = ['optionA', 'optionB', 'optionC'];
        const settings = new Settings('example-module', localize);
        settings.register('example-string', String, 'optionA', { choices });

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-string', expect.objectContaining({
          choices: {
            optionA: 'LOC[setting.example-string.choice.optionA]',
            optionB: 'LOC[setting.example-string.choice.optionB]',
            optionC: 'LOC[setting.example-string.choice.optionC]',
          },
        }));
      });
    });

    describe('range', () => {
      it('defaults range to undefined', () => {
        const settings = new Settings('example-module', localize);
        settings.register('example-number', Number, 0, {});

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-number', expect.any(Object));
        expect(registerSpy.mock.lastCall?.[2]).not.toHaveProperty('range');
      });

      it('passes range to game.settings.register', () => {
        const range = {
          min: 0,
          max: 100,
          step: 5,
        };
        const settings = new Settings('example-module', localize);
        settings.register('example-number', Number, 0, { range });

        expect(registerSpy).toBeCalledTimes(1);
        expect(registerSpy).toBeCalledWith('example-module', 'example-number', expect.objectContaining({
          range,
        }));
      });
    });
  });

  it('delays register until after init hook', () => {
    const settings = new Settings('example-module', localize);

    settings.register('example', Boolean, false);

    expect(registerSpy).toBeCalledTimes(0);

    Hooks.callAll('init');

    expect(registerSpy).toBeCalledTimes(1);
    expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
      name: 'Mock Label',
      type: Boolean,
      default: false,
    }));
  });

  it('registers all settings regisetered before init after init hook', () => {
    const settings = new Settings('example-module', localize);

    settings.register('example', Boolean, false);
    settings.register('example-string', String, 'sample');

    expect(registerSpy).toBeCalledTimes(0);

    Hooks.callAll('init');

    expect(registerSpy).toBeCalledTimes(2);
    expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
      name: 'Mock Label',
      type: Boolean,
      default: false,
    }));
    expect(registerSpy).toBeCalledWith('example-module', 'example-string', expect.objectContaining({
      name: 'Mock Label',
      type: String,
      default: 'sample',
    }));
  });

  it('does not double register if init hook triggers twice', () => {
    const settings = new Settings('example-module', localize);

    settings.register('example', Boolean, false);

    expect(registerSpy).toBeCalledTimes(0);

    Hooks.callAll('init');
    Hooks.callAll('init');

    expect(registerSpy).toBeCalledTimes(1);
    expect(registerSpy).toBeCalledWith('example-module', 'example', expect.objectContaining({
      name: 'Mock Label',
      type: Boolean,
      default: false,
    }));
  });
});

describe('set', () => {
  const setSpy = jest.spyOn(game.settings, 'set');

  describe('namespace', () => {
    it.each([
      'example-module',
      'illandril-chat-enhancements',
      'illandril-token-tooltips',
    ] as const)('passes namespace (%s) to game.settings.set', (namespace) => {
      const settings = new Settings(namespace, localize);
      const setting = settings.register('example', Boolean, false);

      setting.set(false);

      expect(setSpy).toBeCalledTimes(1);
      expect(setSpy).toBeCalledWith(namespace, 'example', false);
    });
  });

  describe('key', () => {
    it.each([
      'example',
      'example-boolean',
    ] as const)('passes key (%s) to game.settings.set', (key) => {
      const settings = new Settings('example-module', localize);
      const setting = settings.register(key, Boolean, false);

      setting.set(false);

      expect(setSpy).toBeCalledTimes(1);
      expect(setSpy).toBeCalledWith('example-module', key, false);
    });
  });

  describe('value', () => {
    it.each([
      true,
      false,
    ] as const)('passes value (%j) to game.settings.set', (value) => {
      const settings = new Settings('example-module', localize);
      const setting = settings.register('example', Boolean, false);

      setting.set(value);

      expect(setSpy).toBeCalledTimes(1);
      expect(setSpy).toBeCalledWith('example-module', 'example', value);
    });
  });
});

describe('get', () => {
  const getSpy = jest.spyOn(game.settings, 'get') as jest.SpyInstance<unknown, [string, string]>;
  beforeEach(() => {
    getSpy.mockReturnValue('mock value');
  });

  describe('namespace', () => {
    it.each([
      'example-module',
      'illandril-chat-enhancements',
      'illandril-token-tooltips',
    ] as const)('passes namespace (%s) to game.settings.get', (namespace) => {
      const settings = new Settings(namespace, localize);
      const setting = settings.register('example', Boolean, false);

      setting.get();

      expect(getSpy).toBeCalledTimes(1);
      expect(getSpy).toBeCalledWith(namespace, 'example');
    });
  });

  describe('key', () => {
    it.each([
      'example',
      'example-boolean',
    ] as const)('passes key (%s) to game.settings.get', (key) => {
      const settings = new Settings('example-module', localize);
      const setting = settings.register(key, Boolean, false);

      setting.get();

      expect(getSpy).toBeCalledTimes(1);
      expect(getSpy).toBeCalledWith('example-module', key);
    });
  });

  describe('value', () => {
    it.each([
      true,
      false,
    ] as const)('returns the value (%j) from game.settings.set', (mockValue) => {
      getSpy.mockReturnValueOnce(mockValue);

      const settings = new Settings('example-module', localize);
      const setting = settings.register('example', Boolean, false);

      const value = setting.get();

      expect(value).toBe(mockValue);
    });
  });
});
