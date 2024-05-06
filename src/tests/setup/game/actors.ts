game.actors.get = (key, options?: { strict: true }) => {
  if (options?.strict) {
    throw new Error(`Not Mocked: game.actors.get(${JSON.stringify(key)}, { strict: true })`);
  }
  return undefined as unknown as Actor;
};
game.actors.find = () => {
  throw new Error('Not Mocked: game.actors.find(...)');
};
