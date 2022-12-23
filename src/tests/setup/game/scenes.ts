game.scenes.get = (key, options?: { strict: true }) => {
  if (options?.strict) {
    throw new Error(`Not Mocked: game.scenes.get(${JSON.stringify(key)}, { strict: true })`);
  }
  return undefined as unknown as Scene;
};
