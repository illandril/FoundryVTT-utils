type LocalizeFN = (key: string, data?: Record<string, string>) => string;

type ValueType<N extends string, K extends string> = K extends 'debug' ? boolean : ClientSettings.Values[`${N}.${K}`];

type TypeArg<N extends string, K extends string> = ClientSettings.TypeConstructor<ValueType<N, K>>;

type SettingOptionsWithDefaults = 'config' | 'scope' | 'requiresReload';
type DerivedSettingsOptions = 'name' | 'hint' | 'type' | 'default' | 'choices';
type SettingConfig<N extends string, K extends string> = {
  hasHint?: boolean
  choices?: ValueType<N, K> extends string ? ValueType<N, K>[] : never
  callOnChangeOnInit?: boolean
}
& Partial<Pick<ClientSettings.Config<ValueType<N, K>>, SettingOptionsWithDefaults>>
& Omit<ClientSettings.Config<ValueType<N, K>>, DerivedSettingsOptions | SettingOptionsWithDefaults>;

export type Setting<T> = {
  get(): T
  set(value: T): void
};

let canRegister = false;
const pendingRegistrations: (() => void)[] = [];
let pendingDebugRegistration: (() => void);

Hooks.once('init', () => {
  canRegister = true;
  pendingRegistrations.forEach((registration) => registration());
  pendingDebugRegistration?.();
});

export default class Settings<N extends string> {
  readonly #namespace: N;
  readonly #localize: LocalizeFN;

  constructor(namespace: N, localize: LocalizeFN) {
    this.#namespace = namespace;
    this.#localize = localize;
  }

  register<K extends string>(key: K, type: TypeArg<N, K>, defaultValue: ValueType<N, K>, {
    scope = 'world',
    hasHint,
    config = true,
    requiresReload = false,
    choices,
    callOnChangeOnInit,
    onChange,
    ...registerOptions
  }: SettingConfig<N, K> = {}): Setting<ValueType<N, K>> {
    const setting = {
      set: (value: ValueType<N, K>) => {
        game.settings.set(this.#namespace, key, value);
      },
      get: (): ValueType<N, K> => game.settings.get(this.#namespace, key),
    };

    const register = () => {
      let choiceOptions;
      if (choices) {
        choiceOptions = {
          choices: Object.fromEntries(choices.map((choice) => [
            choice, this.#localize(`setting.${key}.choice.${choice as string}`),
          ])),
        };
      }
      game.settings.register(this.#namespace, key, {
        name: this.#localize(`setting.${key}.label`),
        hint: hasHint ? this.#localize(`setting.${key}.hint`) : undefined,
        scope, config, type, default: defaultValue,
        requiresReload, onChange,
        ...choiceOptions,
        ...registerOptions,
      } as ClientSettings.Config<ValueType<N, K>>);

      if (callOnChangeOnInit) {
        onChange?.(setting.get());
      }
    };
    if (canRegister) {
      register();
    } else {
      if (key === 'debug') {
        pendingDebugRegistration = register;
      } else {
        pendingRegistrations.push(register);
      }
    }
    return setting;
  }
}
