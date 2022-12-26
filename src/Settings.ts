type ValueType<N extends string, K extends string> = ClientSettings.Values[`${N}.${K}`];

type SettingConfig<N extends string, K extends string> = {
  hasHint?: boolean
} & Partial<Pick<ClientSettings.Config<ValueType<N, K>>, 'config' | 'scope' | 'requiresReload'>>
& Omit<ClientSettings.Config<ValueType<N, K>>, 'name' | 'hint' | 'type' | 'default' | 'config' | 'scope'>;

type LocalizeFN = (key: string, data?: Record<string, string>) => string;

type TypeArg<N extends string, K extends string> = ClientSettings.TypeConstructor<ValueType<N, K>>;

let canRegister = false;
const pendingRegistrations: (() => void)[] = [];

Hooks.once('init', () => {
  canRegister = true;
  pendingRegistrations.forEach((registration) => registration());
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
    ...registerOptions
  }: SettingConfig<N, K> = {}) {
    const register = () => {
      game.settings.register(this.#namespace, key, {
        name: this.#localize(`setting.${key}.label`),
        hint: hasHint ? this.#localize(`setting.${key}.hint`) : undefined,
        scope,
        config,
        default: defaultValue,
        type,
        requiresReload,
        ...registerOptions,
      });
    };
    if (canRegister) {
      register();
    } else {
      pendingRegistrations.push(register);
    }

    return {
      set: (value: ValueType<N, K>) => {
        game.settings.set(this.#namespace, key, value);
      },
      get: (): ValueType<N, K> => game.settings.get(this.#namespace, key),
    };
  }
}
