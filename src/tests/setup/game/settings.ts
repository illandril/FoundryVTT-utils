// eslint-disable-next-line @typescript-eslint/no-explicit-any
const settings = new Map<string, { value: any, onChange?: (value: any) => void }>();
const savedValues = new Map<string, unknown>();

game.settings.register = (module, key, { default: defaultValue, onChange }) => {
  settings.set(`${module}.${key}`, {
    value: savedValues.get(`${module}.${key}`) ?? defaultValue,
    onChange,
  });
};

game.settings.get = <N extends string, K extends string>(module: N, key: K) => {
  const setting = settings.get(`${module}.${key}`);
  if (!setting) {
    throw new Error(`Not registered: ${module}.${key}`);
  }
  return setting.value;
};

game.settings.set = (module: string, key: string, value: unknown) => {
  const setting = settings.get(`${module}.${key}`);
  if (!setting) {
    throw new Error(`Not registered: ${module}.${key}`);
  }
  setting.value = value;
  setting.onChange?.(value);
};

game.settings.registerMenu = () => undefined;

declare global {
  interface SIMULATE {
    mockSavedSetting: (module: string, key: string, value: unknown) => void
  }
}

SIMULATE.mockSavedSetting = (module, key, value) => {
  savedValues.set(`${module}.${key}`, value);
};

export {};
