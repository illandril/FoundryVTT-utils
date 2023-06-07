(foundry.utils as {
  getProperty: typeof foundry.utils.getProperty
}).getProperty = (object, key) => {
  if (!key) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let target: any = object;
  for (const property of key.split('.')) {
    if (typeof target !== 'object' && !Array.isArray(target)) {
      return undefined;
    }
    if (property in target) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      target = target[property];
    } else {
      return undefined;
    }
  }

  return target;
};
