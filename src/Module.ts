import CSSPrefix from './CSSPrefix';
import Logger from './Logger';
import Settings from './Settings';

interface ModuleOptions<N extends string> {
  id: N
  title: string,
  version: string,
  bugs?: string,
  color?: string
}

export default class Module<N extends string> {
  readonly #id: N;
  readonly #logger: Logger;
  readonly #settings: Settings<N>;
  #cssPrefix?: CSSPrefix;

  constructor({ id, title, version, bugs, color }: ModuleOptions<N>) {
    this.#id = id;
    this.#logger = new Logger(`${title} v${version}`, color);
    this.#settings = new Settings(id, this.localize);
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

  get settings() {
    return this.#settings;
  }

  localize = (key: string, data?: Record<string, string>) => {
    const stringId = `${this.#id}.${key}`;
    if (data) {
      return game.i18n.format(stringId, data);
    }
    return game.i18n.localize(stringId);
  };
}
