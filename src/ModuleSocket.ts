export default class ModuleSocket<T extends object> {
  readonly #socketKey: `module.${string}`;

  constructor(moduleID: string) {
    this.#socketKey = `module.${moduleID}`;
  }

  emit(data: T) {
    if (!game.socket) {
      throw new Error('emit was called before game.socket was initialized or after it was torn down');
    }
    game.socket.emit(this.#socketKey, data);
  }

  on(callback: (data: T) => void) {
    if (!game.socket) {
      throw new Error('on was called before game.socket was initialized or after it was torn down');
    }
    game.socket.on(this.#socketKey, callback);
  }
}
