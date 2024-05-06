(
  foundry.utils as {
    getProperty: typeof foundry.utils.getProperty;
  }
).getProperty = (object, key) => {
  if (!key) {
    return undefined;
  }
  let target: unknown = object;
  for (const property of key.split('.')) {
    if ((typeof target !== 'object' && !Array.isArray(target)) || target === null) {
      return undefined;
    }
    if (property in target) {
      target = target[property as keyof typeof target];
    } else {
      return undefined;
    }
  }

  return target;
};

(
  foundry.utils as {
    debounce: typeof foundry.utils.debounce;
  }
).debounce = <T extends []>(callback: (...args: T) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
