import CSSPrefix from './CSSPrefix';
import Logger from './Logger';
import Settings from './Settings';
import Template from './Template';

interface ModuleOptions<N extends string> {
  id: N
  title: string
  version: string
  bugs?: string
  color?: string
}

export default class Module<N extends string> {
  readonly #id: N;
  readonly #logger: Logger;
  readonly #settings: Settings<N>;
  #cssPrefix?: CSSPrefix;

  constructor({ id, title, version, bugs, color }: ModuleOptions<N>) {
    const localize = this.localize.bind(this);
    this.localize = localize;

    this.#id = id;
    this.#settings = new Settings(id, localize);

    const logLevel = {
      debug: false,
    };
    this.#settings.register('debug', Boolean, false, {
      scope: 'client',
      hasHint: true,
      callOnChangeOnInit: true,
      onChange: (value) => {
        logLevel.debug = value;
      },
    });
    this.#logger = new Logger(`${title} v${version}`, logLevel, color);
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

  localize(key: string, data?: Record<string, string>, optional?: false): string;
  localize(key: string, data: Record<string, string> | undefined, optional: true): string | undefined;
  localize(key: string, data?: Record<string, string>, optional = false) {
    const stringId = `${this.#id}.${key}`;
    if (optional === true && !game.i18n.has(stringId)) {
      return undefined;
    }
    if (data) {
      return game.i18n.format(stringId, data);
    }
    return game.i18n.localize(stringId);
  }

  registerTemplate<T extends object>(fileName: `${string}.html`) {
    return new Template<T>(this.#id, fileName);
  }
}
