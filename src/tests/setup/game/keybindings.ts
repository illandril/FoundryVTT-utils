const keybindingMap = new Map<string, ClientKeybindings.KeybindingActionConfig>();

game.keybindings.register = (module, key, data) => {
  keybindingMap.set(`${module}.${key}`, data);
};
game.keybindings.get = (module, key) => keybindingMap.get(`${module}.${key}`)?.editable ?? [];

declare global {
  interface Simulate {
    keyDown: (module: string, key: string) => void;
    keyUp: (module: string, key: string) => void;
  }
}

SIMULATE.keyDown = (module, key) => {
  keybindingMap.get(`${module}.${key}`)?.onDown?.();
};

SIMULATE.keyUp = (module, key) => {
  keybindingMap.get(`${module}.${key}`)?.onUp?.();
};

KeyboardManager.getKeycodeDisplayString = () => 'mock-keycode-display-string';

export type {};
