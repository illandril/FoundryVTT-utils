game.scenes.get = (_key, options?: { strict: true }) => {
  if (options?.strict) {
    throw new Error('Not mocked');
  }
  return undefined as unknown as Scene;
};
