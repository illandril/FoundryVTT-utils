import CSSPrefix from './CSSPrefix';
import Logger from './Logger';

interface ModuleOptions {
  color?: string
}

export default class Module {
  readonly #key: string;
  readonly #logger: Logger;
  #cssPrefix?: CSSPrefix;

  constructor(key: string, name: string, { color }: ModuleOptions = {}) {
    this.#key = key;
    this.#logger = new Logger(name, color);
  }

  get logger() {
    return this.#logger;
  }

  get cssPrefix() {
    if (!this.#cssPrefix) {
      this.#cssPrefix = new CSSPrefix(this.#key);
    }
    return this.#cssPrefix;
  }
}
