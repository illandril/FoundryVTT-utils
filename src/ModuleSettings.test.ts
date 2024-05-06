const localize = jest.fn<string, [string]>();

let ModuleSettings: typeof import('./ModuleSettings').default;

beforeEach(() =>
  import('./ModuleSettings').then((module) => {
    ModuleSettings = module.default;
    jest.resetModules();
    localize.mockImplementation((key: string) => (key.endsWith('.label') ? 'Mock Label' : 'Mock Hint'));
  }),
);

describe('registerMenu', () => {
  const registerMenuSpy = jest.spyOn(game.settings, 'registerMenu');

  type MyMenuOptions = { myOption: boolean } & FormApplicationOptions;

  // biome-ignore lint/complexity/noStaticOnlyClass: A real form would have more functions defined, but this isn't a real form
  class MyMenu extends FormApplication<never, MyMenuOptions> {
    static get defaultOptions() {
      return {
        ...FormApplication.defaultOptions,
        myOption: true,
      };
    }
  }

  const testMenuConfig = {
    icon: 'fas fa-bars',
    type: MyMenu,
    restricted: true,
  } as const;

  describe('pre-initialized', () => {
    beforeEach(() => {
      Hooks.callAll('init');
    });

    describe.each(['example-module', 'illandril-chat-enhancements', 'illandril-token-tooltips'] as const)(
      'namespace: %s',
      (namespace) => {
        it('passes namespace to game.setting.registerMenu', () => {
          const settings = new ModuleSettings(namespace, localize);
          settings.registerMenu('example', testMenuConfig);

          expect(registerMenuSpy).toHaveBeenCalledTimes(1);
          expect(registerMenuSpy).toHaveBeenCalledWith(namespace, 'example', expect.any(Object));
        });

        it('uses namespace to prefix name', () => {
          const settings = new ModuleSettings(namespace, localize);
          settings.registerMenu('example', testMenuConfig);

          expect(registerMenuSpy).toHaveBeenCalledTimes(1);
          expect(registerMenuSpy).toHaveBeenCalledWith(
            namespace,
            'example',
            expect.objectContaining({
              name: `${namespace}.setting.menu.example.name`,
            }),
          );
        });

        it('uses namespace to prefix label', () => {
          const settings = new ModuleSettings(namespace, localize);
          settings.registerMenu('example', testMenuConfig);

          expect(registerMenuSpy).toHaveBeenCalledTimes(1);
          expect(registerMenuSpy).toHaveBeenCalledWith(
            namespace,
            'example',
            expect.objectContaining({
              label: `${namespace}.setting.menu.example.label`,
            }),
          );
        });

        it('uses namespace to prefix hint', () => {
          const settings = new ModuleSettings(namespace, localize);
          settings.registerMenu('example', testMenuConfig);

          expect(registerMenuSpy).toHaveBeenCalledTimes(1);
          expect(registerMenuSpy).toHaveBeenCalledWith(
            namespace,
            'example',
            expect.objectContaining({
              hint: `${namespace}.setting.menu.example.hint`,
            }),
          );
        });

        it('uses namespace to prefix FormApplication ID', () => {
          const settings = new ModuleSettings(namespace, localize);

          const formApplicationOptions = settings.registerMenu('example', testMenuConfig);

          expect(formApplicationOptions).toHaveProperty('id', `${namespace}--menu--example`);
        });

        it('uses namespace to prefix FormApplication title', () => {
          const settings = new ModuleSettings(namespace, localize);

          const formApplicationOptions = settings.registerMenu('example', testMenuConfig);

          expect(formApplicationOptions).toHaveProperty('title', `${namespace}.setting.menu.example.title`);
        });

        it('uses namespace in FormApplication template', () => {
          const settings = new ModuleSettings(namespace, localize);

          const formApplicationOptions = settings.registerMenu('example', testMenuConfig);

          expect(formApplicationOptions).toHaveProperty('template', `modules/${namespace}/templates/menu-example.html`);
        });
      },
    );

    describe.each(['example', 'sample'] as const)('key: %s', (key) => {
      it('passes key to game.setting.registerMenu', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.registerMenu(key, testMenuConfig);

        expect(registerMenuSpy).toHaveBeenCalledTimes(1);
        expect(registerMenuSpy).toHaveBeenCalledWith('example-module', key, expect.any(Object));
      });

      it('uses key in name', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.registerMenu(key, testMenuConfig);

        expect(registerMenuSpy).toHaveBeenCalledTimes(1);
        expect(registerMenuSpy).toHaveBeenCalledWith(
          'example-module',
          key,
          expect.objectContaining({
            name: `example-module.setting.menu.${key}.name`,
          }),
        );
      });

      it('uses key in label', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.registerMenu(key, testMenuConfig);

        expect(registerMenuSpy).toHaveBeenCalledTimes(1);
        expect(registerMenuSpy).toHaveBeenCalledWith(
          'example-module',
          key,
          expect.objectContaining({
            label: `example-module.setting.menu.${key}.label`,
          }),
        );
      });

      it('uses key in hint', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.registerMenu(key, testMenuConfig);

        expect(registerMenuSpy).toHaveBeenCalledTimes(1);
        expect(registerMenuSpy).toHaveBeenCalledWith(
          'example-module',
          key,
          expect.objectContaining({
            hint: `example-module.setting.menu.${key}.hint`,
          }),
        );
      });

      it('uses key in FormApplication ID', () => {
        const settings = new ModuleSettings('example-module', localize);

        const formApplicationOptions = settings.registerMenu(key, testMenuConfig);

        expect(formApplicationOptions).toHaveProperty('id', `example-module--menu--${key}`);
      });

      it('uses key in FormApplication title', () => {
        const settings = new ModuleSettings('example-module', localize);

        const formApplicationOptions = settings.registerMenu(key, testMenuConfig);

        expect(formApplicationOptions).toHaveProperty('title', `example-module.setting.menu.${key}.title`);
      });

      it('uses key in FormApplication template', () => {
        const settings = new ModuleSettings('example-module', localize);

        const formApplicationOptions = settings.registerMenu(key, testMenuConfig);

        expect(formApplicationOptions).toHaveProperty('template', `modules/example-module/templates/menu-${key}.html`);
      });
    });

    it.each(['fas fa-bars', 'my-icon'])('passes icon (%s) to game.setting.registerMenu', (icon) => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerMenu('example', {
        ...testMenuConfig,
        icon,
      });

      expect(registerMenuSpy).toHaveBeenCalledTimes(1);
      expect(registerMenuSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          icon,
        }),
      );
    });

    it('passes type to game.setting.registerMenu', () => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerMenu('example', testMenuConfig);

      expect(registerMenuSpy).toHaveBeenCalledTimes(1);
      expect(registerMenuSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          type: MyMenu,
        }),
      );
    });

    it.each([true, false])('passes restricted (%j) to game.setting.registerMenu', (restricted) => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerMenu('example', {
        ...testMenuConfig,
        restricted,
      });

      expect(registerMenuSpy).toHaveBeenCalledTimes(1);
      expect(registerMenuSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          restricted,
        }),
      );
    });
  });

  it('delays register until after init hook', () => {
    const settings = new ModuleSettings('example-module', localize);

    settings.registerMenu('example', testMenuConfig);

    expect(registerMenuSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');

    expect(registerMenuSpy).toHaveBeenCalledTimes(1);
    expect(registerMenuSpy).toHaveBeenCalledWith(
      'example-module',
      'example',
      expect.objectContaining({
        name: 'example-module.setting.menu.example.name',
        label: 'example-module.setting.menu.example.label',
        hint: 'example-module.setting.menu.example.hint',
      }),
    );
  });

  it('registers all settings regisetered before init after init hook', () => {
    const settings = new ModuleSettings('example-module', localize);

    settings.registerMenu('example1', testMenuConfig);
    settings.registerMenu('example2', testMenuConfig);

    expect(registerMenuSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');

    expect(registerMenuSpy).toHaveBeenCalledTimes(2);
    expect(registerMenuSpy).toHaveBeenCalledWith(
      'example-module',
      'example1',
      expect.objectContaining({
        name: 'example-module.setting.menu.example1.name',
        label: 'example-module.setting.menu.example1.label',
        hint: 'example-module.setting.menu.example1.hint',
      }),
    );
    expect(registerMenuSpy).toHaveBeenCalledWith(
      'example-module',
      'example2',
      expect.objectContaining({
        name: 'example-module.setting.menu.example2.name',
        label: 'example-module.setting.menu.example2.label',
        hint: 'example-module.setting.menu.example2.hint',
      }),
    );
  });

  it('does not double register if init hook triggers twice', () => {
    const settings = new ModuleSettings('example-module', localize);

    settings.registerMenu('example', testMenuConfig);

    expect(registerMenuSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');
    Hooks.callAll('init');

    expect(registerMenuSpy).toHaveBeenCalledTimes(1);
    expect(registerMenuSpy).toHaveBeenCalledWith(
      'example-module',
      'example',
      expect.objectContaining({
        name: 'example-module.setting.menu.example.name',
        label: 'example-module.setting.menu.example.label',
        hint: 'example-module.setting.menu.example.hint',
      }),
    );
  });
});

describe('register', () => {
  const registerSpy = jest.spyOn(game.settings, 'register');

  describe('pre-initialized', () => {
    beforeEach(() => {
      Hooks.callAll('init');
    });

    describe('namespace', () => {
      it.each(['example-module', 'illandril-chat-enhancements', 'illandril-token-tooltips'] as const)(
        'passes namespace (%s) to game.setting.register',
        (namespace) => {
          const settings = new ModuleSettings(namespace, localize);
          settings.register('example', Boolean, false);

          expect(registerSpy).toHaveBeenCalledTimes(1);
          expect(registerSpy).toHaveBeenCalledWith(namespace, 'example', expect.any(Object));
        },
      );
    });

    describe('key', () => {
      it.each(['example', 'example-boolean', 'debug'] as const)(
        'passes key (%s) to game.setting.register and localize',
        (key) => {
          const settings = new ModuleSettings('example-module', localize);
          settings.register(key, Boolean, false);

          expect(registerSpy).toHaveBeenCalledTimes(1);
          expect(registerSpy).toHaveBeenCalledWith(
            'example-module',
            key,
            expect.objectContaining({
              name: 'Mock Label',
            }),
          );

          expect(localize).toHaveBeenCalledTimes(1);
          expect(localize).toHaveBeenCalledWith(`setting.${key}.label`);
        },
      );
    });

    describe('type', () => {
      it('passes correct type for boolean settings', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example-boolean', Boolean, false);

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-boolean',
          expect.objectContaining({
            type: Boolean,
          }),
        );
      });

      it('passes correct type for number settings', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example-number', Number, 0);

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-number',
          expect.objectContaining({
            type: Number,
          }),
        );
      });

      it('passes correct type for string settings', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example-string', String, '');

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-string',
          expect.objectContaining({
            type: String,
          }),
        );
      });

      it('passes correct type for object settings', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example-object', Object, {});

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-object',
          expect.objectContaining({
            type: Object,
          }),
        );
      });
    });

    describe('default', () => {
      it.each([-1, 0, 1, 2, 3, 5, 8, 13])('passes correct default for number settings (%i)', (defaultValue) => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example-number', Number, defaultValue);

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-number',
          expect.objectContaining({
            default: defaultValue,
          }),
        );
      });
    });

    describe('hint', () => {
      it('includes a localized hint if hasHint is true', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, { hasHint: true });

        expect(localize).toHaveBeenCalledTimes(2);
        expect(localize).toHaveBeenCalledWith('setting.example.label');
        expect(localize).toHaveBeenCalledWith('setting.example.hint');

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            name: 'Mock Label',
            hint: 'Mock Hint',
          }),
        );
      });

      it('does not include a hint if hasHint is false', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, { hasHint: false });

        expect(localize).toHaveBeenCalledTimes(1);
        expect(localize).toHaveBeenCalledWith('setting.example.label');

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            name: 'Mock Label',
            hint: undefined,
          }),
        );
      });

      it('does not include a hint if hasHint not specified', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(localize).toHaveBeenCalledTimes(1);
        expect(localize).toHaveBeenCalledWith('setting.example.label');

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            name: 'Mock Label',
            hint: undefined,
          }),
        );
      });
    });

    describe('scope', () => {
      it('defaults scope to world', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            scope: 'world',
          }),
        );
      });

      it.each(['client', 'world'] as const)('passes scope (%s) to game.setting.register', (scope) => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, { scope });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            scope,
          }),
        );
      });
    });

    describe('config', () => {
      it('defaults config to true', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            config: true,
          }),
        );
      });

      it.each([true, false])('passes config (%j) to game.setting.register', (config) => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, { config });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            config,
          }),
        );
      });

      it.each([true, false])(
        'calls config function (%j) and passes result to game.setting.register',
        (configReturn) => {
          const config = jest.fn(() => configReturn);
          const settings = new ModuleSettings('example-module', localize);
          settings.register('example', Boolean, false, { config });

          expect(registerSpy).toHaveBeenCalledTimes(1);
          expect(registerSpy).toHaveBeenCalledWith(
            'example-module',
            'example',
            expect.objectContaining({
              config: configReturn,
            }),
          );
          expect(config).toHaveBeenCalledTimes(1);
        },
      );
    });

    describe('requiresReload', () => {
      it('defaults requiresReload to false', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            requiresReload: false,
          }),
        );
      });

      it.each([true, false])('passes requiresReload (%j) to game.setting.register', (requiresReload) => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, { requiresReload });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            requiresReload,
          }),
        );
      });
    });

    describe('onChange', () => {
      it('defaults onChange to undefined', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, {});

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith('example-module', 'example', expect.any(Object));
        expect(registerSpy.mock.lastCall?.[2].onChange).toBeUndefined();
      });

      it('passes onChange to game.setting.register', () => {
        const onChange = () => undefined;
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example', Boolean, false, { onChange });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            onChange,
          }),
        );
      });

      it.each([true, false])(
        'calls onChange with current value (%j) after init if callOnChangeOnInit=true',
        (currentValue) => {
          const getSpy = jest.spyOn(game.settings, 'get').mockImplementation((module, key) => {
            if (module === 'example-module' && key === 'example') {
              return currentValue as never;
            }
            throw new Error(`Unexpected setting ${module}.${key}`);
          });

          const onChange = jest.fn();
          const settings = new ModuleSettings('example-module', localize);
          settings.register('example', Boolean, false, { onChange, callOnChangeOnInit: true });

          expect(registerSpy).toHaveBeenCalledTimes(1);
          expect(registerSpy).toHaveBeenCalledWith(
            'example-module',
            'example',
            expect.objectContaining({
              onChange,
            }),
          );
          expect(getSpy).toHaveBeenCalledTimes(1);
          expect(onChange).toHaveBeenCalledTimes(1);
          expect(onChange).toHaveBeenCalledWith(currentValue);
        },
      );

      it.each([false, undefined])(
        'does not call onChange after init if callOnChangeOnInit=%j',
        (callOnChangeOnInit) => {
          const onChange = jest.fn();
          const settings = new ModuleSettings('example-module', localize);
          settings.register('example', Boolean, false, { onChange, callOnChangeOnInit });

          expect(registerSpy).toHaveBeenCalledTimes(1);
          expect(registerSpy).toHaveBeenCalledWith(
            'example-module',
            'example',
            expect.objectContaining({
              onChange,
            }),
          );
          expect(onChange).not.toHaveBeenCalled();
        },
      );
    });

    describe('choices', () => {
      it('defaults choices to undefined', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example-string', String, 'optionA', {});

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith('example-module', 'example-string', expect.any(Object));
        expect(registerSpy.mock.lastCall?.[2]).not.toHaveProperty('choices');
      });

      it('converts choices string[] to choices object for game.setting.register', () => {
        localize.mockImplementation((key) => `LOC[${key}]`);

        type ChoiceType = 'optionA' | 'optionB' | 'optionC';
        const settings = new ModuleSettings('example-module', localize);
        settings.register<ChoiceType>('example-string', String, 'optionA', {
          choices: ['optionA', 'optionB', 'optionC'],
        });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-string',
          expect.objectContaining({
            choices: {
              optionA: 'LOC[setting.example-string.choice.optionA]',
              optionB: 'LOC[setting.example-string.choice.optionB]',
              optionC: 'LOC[setting.example-string.choice.optionC]',
            },
          }),
        );
      });

      it('passes Record<string, string> choices to game.setting.register unaltered', () => {
        localize.mockImplementation((key) => `LOC[${key}]`);

        type ChoiceType = 'optionA' | 'optionB' | 'optionC';
        const settings = new ModuleSettings('example-module', localize);
        settings.register<ChoiceType>('example-string', String, 'optionA', {
          choices: {
            optionA: 'My first option',
            optionB: 'Second',
            optionC: 'Final choice',
          },
        });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-string',
          expect.objectContaining({
            choices: {
              optionA: 'My first option',
              optionB: 'Second',
              optionC: 'Final choice',
            },
          }),
        );
      });

      it('converts Record<string, function> to choices object to game.setting.register', () => {
        localize.mockImplementation((key) => `LOC[${key}]`);

        type ChoiceType = 'optionA' | 'optionB' | 'optionC';
        const settings = new ModuleSettings('example-module', localize);
        const optionA = jest.fn().mockReturnValue('My first option');
        const optionB = jest.fn().mockReturnValue('Second');
        const optionC = jest.fn().mockReturnValue('Final choice');
        settings.register<ChoiceType>('example-string', String, 'optionA', {
          choices: {
            optionA,
            optionB,
            optionC,
          },
        });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-string',
          expect.objectContaining({
            choices: {
              optionA: 'My first option',
              optionB: 'Second',
              optionC: 'Final choice',
            },
          }),
        );

        expect(optionA).toHaveBeenCalledTimes(1);
        expect(optionB).toHaveBeenCalledTimes(1);
        expect(optionC).toHaveBeenCalledTimes(1);
      });
    });

    describe('range', () => {
      it('defaults range to undefined', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example-number', Number, 0, {});

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith('example-module', 'example-number', expect.any(Object));
        expect(registerSpy.mock.lastCall?.[2]).not.toHaveProperty('range');
      });

      it('passes range to game.setting.register', () => {
        const range = {
          min: 0,
          max: 100,
          step: 5,
        };
        const settings = new ModuleSettings('example-module', localize);
        settings.register('example-number', Number, 0, { range });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example-number',
          expect.objectContaining({
            range,
          }),
        );
      });
    });
  });

  it('delays register until after init hook', () => {
    const settings = new ModuleSettings('example-module', localize);

    settings.register('example', Boolean, false);

    expect(registerSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');

    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example',
      expect.objectContaining({
        name: 'Mock Label',
        type: Boolean,
        default: false,
      }),
    );
  });

  it('registers all settings regisetered before init after init hook', () => {
    const settings = new ModuleSettings('example-module', localize);

    settings.register('example', Boolean, false);
    settings.register('example-string', String, 'sample');

    expect(registerSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');

    expect(registerSpy).toHaveBeenCalledTimes(2);
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example',
      expect.objectContaining({
        name: 'Mock Label',
        type: Boolean,
        default: false,
      }),
    );
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example-string',
      expect.objectContaining({
        name: 'Mock Label',
        type: String,
        default: 'sample',
      }),
    );
  });

  it('does not double register if init hook triggers twice', () => {
    const settings = new ModuleSettings('example-module', localize);

    settings.register('example', Boolean, false);

    expect(registerSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');
    Hooks.callAll('init');

    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example',
      expect.objectContaining({
        name: 'Mock Label',
        type: Boolean,
        default: false,
      }),
    );
  });

  it('calls choices functions after init', () => {
    localize.mockImplementation((key) => `LOC[${key}]`);

    type ChoiceType = 'optionA' | 'optionB' | 'optionC';
    const settings = new ModuleSettings('example-module', localize);
    const optionA = jest.fn().mockReturnValue('My first option');
    const optionB = jest.fn().mockReturnValue('Second');
    const optionC = jest.fn().mockReturnValue('Final choice');
    settings.register<ChoiceType>('example-string', String, 'optionA', {
      choices: {
        optionA,
        optionB,
        optionC,
      },
    });

    expect(optionA).toHaveBeenCalledTimes(0);
    expect(optionB).toHaveBeenCalledTimes(0);
    expect(optionC).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');

    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example-string',
      expect.objectContaining({
        choices: {
          optionA: 'My first option',
          optionB: 'Second',
          optionC: 'Final choice',
        },
      }),
    );

    expect(optionA).toHaveBeenCalledTimes(1);
    expect(optionB).toHaveBeenCalledTimes(1);
    expect(optionC).toHaveBeenCalledTimes(1);
  });
});

describe('set', () => {
  const setSpy = jest.spyOn(game.settings, 'set');

  describe('namespace', () => {
    it.each(['example-module', 'illandril-chat-enhancements', 'illandril-token-tooltips'] as const)(
      'passes namespace (%s) to game.setting.set',
      (namespace) => {
        const settings = new ModuleSettings(namespace, localize);
        const setting = settings.register('example', Boolean, false);

        setting.set(false);

        expect(setSpy).toHaveBeenCalledTimes(1);
        expect(setSpy).toHaveBeenCalledWith(namespace, 'example', false);
      },
    );
  });

  describe('key', () => {
    it.each(['example', 'example-boolean'] as const)('passes key (%s) to game.setting.set', (key) => {
      const settings = new ModuleSettings('example-module', localize);
      const setting = settings.register(key, Boolean, false);

      setting.set(false);

      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(setSpy).toHaveBeenCalledWith('example-module', key, false);
    });
  });

  describe('value', () => {
    it.each([true, false] as const)('passes value (%j) to game.setting.set', (value) => {
      const settings = new ModuleSettings('example-module', localize);
      const setting = settings.register('example', Boolean, false);

      setting.set(value);

      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(setSpy).toHaveBeenCalledWith('example-module', 'example', value);
    });
  });
});

describe('get', () => {
  const getSpy = jest.spyOn(game.settings, 'get') as jest.SpyInstance<unknown, [string, string]>;
  beforeEach(() => {
    getSpy.mockReturnValue('mock value');
  });

  describe('namespace', () => {
    it.each(['example-module', 'illandril-chat-enhancements', 'illandril-token-tooltips'] as const)(
      'passes namespace (%s) to game.setting.get',
      (namespace) => {
        const settings = new ModuleSettings(namespace, localize);
        const setting = settings.register('example', Boolean, false);

        setting.get();

        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith(namespace, 'example');
      },
    );
  });

  describe('key', () => {
    it.each(['example', 'example-boolean'] as const)('passes key (%s) to game.setting.get', (key) => {
      const settings = new ModuleSettings('example-module', localize);
      const setting = settings.register(key, Boolean, false);

      setting.get();

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledWith('example-module', key);
    });
  });

  describe('value', () => {
    it.each([true, false] as const)('returns the value (%j) from game.setting.set', (mockValue) => {
      getSpy.mockReturnValueOnce(mockValue);

      const settings = new ModuleSettings('example-module', localize);
      const setting = settings.register('example', Boolean, false);

      const value = setting.get();

      expect(value).toBe(mockValue);
    });
  });
});

describe('registerKeybinding', () => {
  const registerSpy = jest.spyOn(game.keybindings, 'register');
  const onDown = jest.fn();
  const onUp = jest.fn();

  describe('pre-initialized', () => {
    beforeEach(() => {
      Hooks.callAll('init');
    });

    describe.each(['example-module', 'illandril-chat-enhancements', 'illandril-token-tooltips'] as const)(
      'namespace: %s',
      (namespace) => {
        it('passes namespace to game.keybindings.register', () => {
          const settings = new ModuleSettings(namespace, localize);
          settings.registerKeybinding('example', onDown, onUp);

          expect(registerSpy).toHaveBeenCalledTimes(1);
          expect(registerSpy).toHaveBeenCalledWith(namespace, 'example', expect.any(Object));
        });

        it('uses localize for name', () => {
          const settings = new ModuleSettings(namespace, localize);
          settings.registerKeybinding('example', onDown, onUp);

          expect(localize).toHaveBeenCalledWith('hotkey.example.label');

          expect(registerSpy).toHaveBeenCalledTimes(1);
          expect(registerSpy).toHaveBeenCalledWith(
            namespace,
            'example',
            expect.objectContaining({
              name: 'Mock Label',
            }),
          );
        });

        it('uses localize for hint', () => {
          const settings = new ModuleSettings(namespace, localize);
          settings.registerKeybinding('example', onDown, onUp, { hasHint: true });

          expect(localize).toHaveBeenCalledWith('hotkey.example.hint');

          expect(registerSpy).toHaveBeenCalledTimes(1);
          expect(registerSpy).toHaveBeenCalledWith(
            namespace,
            'example',
            expect.objectContaining({
              hint: 'Mock Hint',
            }),
          );
        });
      },
    );

    describe.each(['example', 'sample'] as const)('key: %s', (key) => {
      it('passes key to game.keybindings.register', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.registerKeybinding(key, onDown, onUp);

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith('example-module', key, expect.any(Object));
      });

      it('uses key in name', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.registerKeybinding(key, onDown, onUp);

        expect(localize).toHaveBeenCalledWith(`hotkey.${key}.label`);

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          key,
          expect.objectContaining({
            name: 'Mock Label',
          }),
        );
      });

      it('uses key in hint', () => {
        const settings = new ModuleSettings('example-module', localize);
        settings.registerKeybinding(key, onDown, onUp, { hasHint: true });

        expect(localize).toHaveBeenCalledWith(`hotkey.${key}.hint`);

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          key,
          expect.objectContaining({
            hint: 'Mock Hint',
          }),
        );
      });
    });

    it('omits hint by default', () => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp);

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          hint: undefined,
        }),
      );
    });

    it('omits hint if hasHint is false', () => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp, {
        hasHint: false,
      });

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          hint: undefined,
        }),
      );
    });

    it('includes hint if hasHint is true', () => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp, {
        hasHint: true,
      });

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          hint: 'Mock Hint',
        }),
      );
    });

    it('passes callbacks to game.keybindings.register', () => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp);

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          onDown,
          onUp,
        }),
      );
    });

    it.each([true, false])('passes repeat (%j) to game.keybindings.register', (repeat) => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp, {
        repeat,
      });

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          repeat,
        }),
      );
    });

    it.each([true, false])('passes repeat (%j) to game.keybindings.register', (repeat) => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp, {
        repeat,
      });

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          repeat,
        }),
      );
    });

    it.each([true, false])('passes restricted (%j) to game.keybindings.register', (restricted) => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp, {
        restricted,
      });

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          restricted,
        }),
      );
    });

    it('passes empty array to editable by default', () => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp);

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          editable: [],
        }),
      );
    });

    it('passes defaultKeybindings as editable', () => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp, {
        defaultKeybindings: [
          {
            key: 'A',
          },
          {
            key: 'Mock',
            modifiers: 'Ctrl',
          },
        ],
      });

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          editable: [
            {
              key: 'A',
            },
            {
              key: 'Mock',
              modifiers: 'Ctrl',
            },
          ],
        }),
      );
    });

    it('defaults precedence to NORMAL', () => {
      const settings = new ModuleSettings('example-module', localize);
      settings.registerKeybinding('example', onDown, onUp);

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(
        'example-module',
        'example',
        expect.objectContaining({
          precedence: foundry.CONST.KEYBINDING_PRECEDENCE.NORMAL,
        }),
      );
    });

    it.each(Object.values(foundry.CONST.KEYBINDING_PRECEDENCE))(
      'passes precedence (%j) to game.keybindings.register',
      (precedence) => {
        const settings = new ModuleSettings('example-module', localize);
        settings.registerKeybinding('example', onDown, onUp, {
          precedence,
        });

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith(
          'example-module',
          'example',
          expect.objectContaining({
            precedence,
          }),
        );
      },
    );

    it('sanity check for mocked KEYBINDING_PRECEDENCE values', () => {
      // If this isn't correct, the previous 'precedence' tests
      // aren't valid
      // Note: The specific values used aren't important to the other
      //       tests, only that they are all specified and unique
      expect(foundry.CONST.KEYBINDING_PRECEDENCE).toEqual({
        // biome-ignore lint/style/useNamingConvention: FoundryVTT defined const
        PRIORITY: 0,
        // biome-ignore lint/style/useNamingConvention: FoundryVTT defined const
        NORMAL: 1,
        // biome-ignore lint/style/useNamingConvention: FoundryVTT defined const
        DEFERRED: 2,
      });
    });
  });

  it('delays register until after init hook', () => {
    const settings = new ModuleSettings('example-module', localize);

    settings.registerKeybinding('example', onDown, onUp);

    expect(registerSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');

    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example',
      expect.objectContaining({
        onDown,
        onUp,
      }),
    );
  });

  it('registers all settings regisetered before init after init hook', () => {
    const settings = new ModuleSettings('example-module', localize);

    const onDown2 = jest.fn();
    const onUp2 = jest.fn();
    settings.registerKeybinding('example1', onDown, onUp);
    settings.registerKeybinding('example2', onDown2, onUp2);

    expect(registerSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');

    expect(registerSpy).toHaveBeenCalledTimes(2);
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example1',
      expect.objectContaining({
        onDown,
        onUp,
      }),
    );
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example2',
      expect.objectContaining({
        onDown: onDown2,
        onUp: onUp2,
      }),
    );
  });

  it('does not double register if init hook triggers twice', () => {
    const settings = new ModuleSettings('example-module', localize);

    settings.registerKeybinding('example', onDown, onUp);

    expect(registerSpy).toHaveBeenCalledTimes(0);

    Hooks.callAll('init');
    Hooks.callAll('init');

    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(
      'example-module',
      'example',
      expect.objectContaining({
        onDown,
        onUp,
      }),
    );
  });
});
