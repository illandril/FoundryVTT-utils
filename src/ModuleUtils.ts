import CSSPrefix from './CSSPrefix';
import Logger from './Logger';
import ModuleSettings from './ModuleSettings';
import ModuleSocket from './ModuleSocket';
import Template from './Template';

interface ModuleOptions<N extends string> {
  id: N;
  title: string;
  version: string;
  bugs?: string;
  color?: string;
}

export default class ModuleUtils<N extends string> {
  readonly #id: N;
  readonly #logger: Logger;
  readonly #settings: ModuleSettings<N>;
  #cssPrefix?: CSSPrefix;
  #socketInitialized = false;

  constructor({ id, title, version, bugs, color }: ModuleOptions<N>) {
    const localize = this.localize.bind(this);
    this.localize = localize;

    this.#id = id;
    this.#settings = new ModuleSettings(id, localize);

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

  get id() {
    return this.#id;
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

  initializeSocket<T extends object>() {
    if (this.#socketInitialized) {
      throw new Error(
        'Socket should only be initialized once (to ensure the same generic type is used for all socket messages sent by this module, since they will all use the same message key)',
      );
    }
    this.#socketInitialized = true;
    return new ModuleSocket<T>(this.#id);
  }
}
