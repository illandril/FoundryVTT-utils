type LocalizeFN = (key: string) => string;

type RegisterOptions<T> = {
  hasHint?: boolean
  callOnChangeOnInit?: boolean
  config?: ClientSettings.Config<T>['config']
  scope?: ClientSettings.Config<T>['scope']
  requiresReload?: ClientSettings.Config<T>['requiresReload']
  onChange?: ClientSettings.Config<T>['onChange']
  range?: ClientSettings.Config<T>['range']
  choices?: (T extends string ? T : never)[] | (T extends string ? { [name: string]: string } : never)
};

type RegisterMenuOptions<
  ObjectType extends object,
  Options extends FormApplicationOptions,
> = Omit<ClientSettings.MenuConfig<ObjectType, Options>, 'name' | 'label' | 'hint'>;

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

  registerMenu<
    ObjectType extends object,
    Options extends FormApplicationOptions,
  >(key: string, data: RegisterMenuOptions<ObjectType, Options>) {
    const prefixedData = {
      ...data,
      name: `${this.#namespace}.setting.menu.${key}.name`,
      label: `${this.#namespace}.setting.menu.${key}.label`,
      hint: `${this.#namespace}.setting.menu.${key}.hint`,
    };
    const register = () => {
      game.settings.registerMenu(this.#namespace, key, prefixedData);
    };
    if (canRegister) {
      register();
    } else {
      pendingRegistrations.push(register);
    }
    return {
      id: `${this.#namespace}--menu--${key}`,
      title: `${this.#namespace}.setting.menu.${key}.title`,
      template: `modules/${this.#namespace}/templates/menu-${key}.html`,
    } as const;
  }

  #mapChoices(key: string, choices: string[] | { [name: string]: string } | undefined) {
    let choiceOptions;
    if (choices) {
      if (Array.isArray(choices)) {
        choiceOptions = {
          choices: Object.fromEntries(choices.map((choice) => [
            choice, this.#localize(`setting.${key}.choice.${choice}`),
          ])),
        };
      } else {
        choiceOptions = { choices };
      }
    }
    return choiceOptions;
  }

  register<T>(
    key: string,
    type: ClientSettings.TypeConstructor<T>,
    defaultValue: T,
    {
      scope = 'world',
      hasHint,
      config = true,
      requiresReload = false,
      choices,
      callOnChangeOnInit,
      onChange,
      ...registerOptions
    }: RegisterOptions<T> = {},
  ) {
    const setting = {
      set: (value: T) => {
        game.settings.set(this.#namespace, key, value);
      },
      get: (): T => game.settings.get(this.#namespace, key) as T,
    };

    const register = () => {
      const choiceOptions = this.#mapChoices(key, choices);
      game.settings.register(this.#namespace, key, {
        name: this.#localize(`setting.${key}.label`),
        hint: hasHint ? this.#localize(`setting.${key}.hint`) : undefined,
        scope, config, type, default: defaultValue,
        requiresReload, onChange,
        ...choiceOptions,
        ...registerOptions,
      } as ClientSettings.Config<T>);

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
