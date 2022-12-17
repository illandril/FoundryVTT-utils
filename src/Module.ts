import CSSPrefix from './CSSPrefix';
import Logger from './Logger';

interface ModuleOptions {
  id: string
  title: string,
  version: string,
  bugs?: string,
  color?: string
}

export default class Module {
  readonly #id: string;
  readonly #logger: Logger;
  #cssPrefix?: CSSPrefix;

  constructor({ id, title, version, bugs, color }: ModuleOptions) {
    this.#id = id;
    this.#logger = new Logger(`${title} v${version}`, color);
    if (bugs) {
      this.logger.info(`Started. To report bugs, go to: ${bugs}`);
    } else {
      this.logger.info('Started');
    }
  }

  get logger() {
    return this.#logger;
  }

  get cssPrefix() {
    if (!this.#cssPrefix) {
      this.#cssPrefix = new CSSPrefix(this.#id);
    }
    return this.#cssPrefix;
  }
}
