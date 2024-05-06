// biome-ignore lint/suspicious/noConfusingVoidType: There are two types of Hooks - hooks that can stop an event (return boolean) and ones that don't (void)
type Callback = (...args: unknown[]) => boolean | undefined | void;

const hookMap = new Map<string, Callback[]>();
const hookOnceMap = new Map<string, Callback[]>();

Hooks.on = (key, fn) => {
  let array = hookMap.get(key);
  if (!array) {
    array = [];
    hookMap.set(key, array);
  }
  array.push(fn as Callback);
};

Hooks.once = (key, fn) => {
  let array = hookOnceMap.get(key);
  if (!array) {
    array = [];
    hookOnceMap.set(key, array);
  }
  array.push(fn as Callback);
};

Hooks.callAll = (key, ...args) => {
  let callbacks = hookMap.get(key);
  if (callbacks) {
    for (const callback of callbacks) {
      callback(...args);
    }
  }
  callbacks = hookOnceMap.get(key);
  if (callbacks) {
    hookOnceMap.delete(key);
    for (const callback of callbacks) {
      callback(...args);
    }
  }
  return true;
};

Hooks.call = (key, ...args) => {
  let callbacks = hookMap.get(key);
  if (callbacks) {
    for (const callback of callbacks) {
      const callAdditional = callback(...args);
      if (callAdditional === false) {
        return false;
      }
    }
  }
  callbacks = hookOnceMap.get(key);
  if (callbacks) {
    hookOnceMap.delete(key);
    for (const callback of callbacks) {
      const callAdditional = callback(...args);
      if (callAdditional === false) {
        return false;
      }
    }
  }
  return true;
};

declare global {
  interface Simulate {
    clearHook: (key: string) => void;
    clearAllHooks: () => void;
  }
}

SIMULATE.clearHook = (key) => {
  hookMap.delete(key);
  hookOnceMap.delete(key);
};
SIMULATE.clearAllHooks = () => {
  hookMap.clear();
  hookOnceMap.clear();
};

export type {};
