type LocalizeFN = (key: string) => string;

type ChoicesObject = { [name: string]: string };
type ChoicesArray = readonly string[] | string[];
type Choices = ChoicesArray | ChoicesObject;

type RegisterOptions<T> = {
  hasHint?: boolean
  callOnChangeOnInit?: boolean
  config?: boolean | (() => boolean)
  scope?: ClientSettings.Config<T>['scope']
  requiresReload?: ClientSettings.Config<T>['requiresReload']
  onChange?: ClientSettings.Config<T>['onChange']
  range?: ClientSettings.Config<T>['range']
  choices?: (T extends string ? Choices : never)
};

type RegisterMenuOptions<
  ObjectType extends object,
  Options extends FormApplicationOptions,
> = Omit<ClientSettings.MenuConfig<ObjectType, Options>, 'name' | 'label' | 'hint'>;

type RegisterKeybindingOptions = {
  hasHint?: boolean
  defaultKeybindings?: ClientKeybindings.KeybindingActionBinding[]
  repeat?: boolean
  restricted?: boolean
  precedence?: number
};

export type Setting<T> = {
  get(): T
  set(value: T): void
};

// Workaround for readonly array typing issue: https://github.com/microsoft/TypeScript/issues/17002
const isChoicesArray = Array.isArray as (obj: Choices | undefined) => obj is ChoicesArray;

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

  #mapChoices(key: string, choices: Choices | undefined) {
    let choiceOptions;
    if (choices) {
      if (isChoicesArray(choices)) {
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
        config: typeof config === 'function' ? config() : config,
        scope, type, default: defaultValue,
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

  registerKeybinding(
    key: string,
    onDown: () => void,
    onUp: () => void,
    {
      hasHint,
      defaultKeybindings,
      precedence = foundry.CONST.KEYBINDING_PRECEDENCE.NORMAL,
      ...registerOptions
    }: RegisterKeybindingOptions = {},
  ) {
    const register = () => {
      game.keybindings.register(this.#namespace, key, {
        name: this.#localize(`hotkey.${key}.label`),
        hint: hasHint ? this.#localize(`hotkey.${key}.hint`) : undefined,
        editable: defaultKeybindings ?? [],
        onDown,
        onUp,
        precedence,
        ...registerOptions,
      });
    };
    if (canRegister) {
      register();
    } else {
      pendingRegistrations.push(register);
    }
  }
}
