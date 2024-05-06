type LogLevel = {
  readonly debug: boolean;
};

export default class Logger {
  readonly #logName: string;
  readonly #logColor: string;
  readonly #logPrefix: string;
  readonly #logStyle: string;
  readonly #logLevel: LogLevel;

  constructor(logName: string, logLevel: LogLevel, logColor = '#4f0104') {
    this.#logName = logName;
    this.#logLevel = logLevel;
    this.#logColor = logColor;
    this.#logPrefix = `%c${logName}`;
    this.#logStyle = `background-color: ${logColor}; color: #fff; padding: 0.1em 0.5em;`;
  }

  child(childName: string, childColor = this.#logColor) {
    return new Logger(`${this.#logName} - ${childName}`, this.#logLevel, childColor);
  }

  debug(...data: unknown[]) {
    if (this.#logLevel.debug) {
      // biome-ignore lint/nursery/noConsole: console calls via Logger is allowed
      console.debug(this.#logPrefix, this.#logStyle, ...data);
    }
  }

  info(...data: unknown[]) {
    // biome-ignore lint/nursery/noConsole: console calls via Logger is allowed
    console.info(this.#logPrefix, this.#logStyle, ...data);
  }

  warn(...data: unknown[]) {
    // biome-ignore lint/nursery/noConsole: console calls via Logger is allowed
    console.warn(this.#logPrefix, this.#logStyle, ...data);
  }

  error(...data: unknown[]) {
    // biome-ignore lint/nursery/noConsole: console calls via Logger is allowed
    console.error(this.#logPrefix, this.#logStyle, ...data);
  }
}
