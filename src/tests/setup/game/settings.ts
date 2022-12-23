game.settings.register = () => undefined;
game.settings.get = (module, key) => {
  throw new Error(`Not Mocked: game.settings.get(${JSON.stringify(module)}, ${JSON.stringify(key)})`);
};
game.settings.set = () => undefined;
