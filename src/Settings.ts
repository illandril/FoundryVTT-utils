type ValueType<N extends string, K extends string> = ClientSettings.Values[`${N}.${K}`];

type SettingConfig<N extends string, K extends string> = {
  scope?: 'client' | 'world'
  hasHint?: boolean
  config?: boolean
  requiresReload?: boolean,
  onChange?: (value: ValueType<N, K>) => void,
};

type LocalizeFN = (key: string, data?: Record<string, string>) => string;

type TypeArg<N extends string, K extends string> = ClientSettings.SettingConstructor<ValueType<N, K>>;

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
    onChange,
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
        onChange,
      });
    };
    if (canRegister) {
      register();
    } else {
      pendingRegistrations.push(register);
    }
  }

  set <K extends string>(key: K, value: ValueType<N, K>) {
    game.settings.set(this.#namespace, key, value);
  }

  get <K extends string>(key: K): ValueType<N, K> {
    return game.settings.get(this.#namespace, key);
  }
}
