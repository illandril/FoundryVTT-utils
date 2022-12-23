type Callback = ((...args: unknown[]) => void);

const hookMap = new Map<string, Callback[]>();
const hookOnceMap = new Map<string, Callback[]>();

afterEach(() => {
  hookMap.clear();
  hookOnceMap.clear();
});

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
};
