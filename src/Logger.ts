export default class Logger {
  readonly #logName: string;
  readonly #logColor: string;
  readonly #logPrefix: string;
  readonly #logStyle: string;

  constructor(moduleName: string, logColor = '#4f0104') {
    this.#logName = moduleName;
    this.#logColor = logColor;
    this.#logPrefix = `%c${moduleName}`;
    this.#logStyle = `background-color: ${logColor}; color: #fff; padding: 0.1em 0.5em;`;
  }

  child(childName: string, childColor = this.#logColor) {
    return new Logger(`${this.#logName} - ${childName}`, childColor);
  }

  debug(...data: unknown[]) {
    // eslint-disable-next-line no-console
    console.debug(this.#logPrefix, this.#logStyle, ...data);
  }

  info(...data: unknown[]) {
    // eslint-disable-next-line no-console
    console.info(this.#logPrefix, this.#logStyle, ...data);
  }

  warn(...data: unknown[]) {
    // eslint-disable-next-line no-console
    console.warn(this.#logPrefix, this.#logStyle, ...data);
  }

  error(...data: unknown[]) {
    // eslint-disable-next-line no-console
    console.error(this.#logPrefix, this.#logStyle, ...data);
  }
}
