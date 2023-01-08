export default class Template<T extends object> {
  readonly #path: string;

  constructor(moduleID: string, fileName: `${string}.html`) {
    this.#path = `modules/${moduleID}/templates/${fileName}`;

    // Pre-load the template
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getTemplate(this.#path);
  }

  async render(data: T) {
    return renderTemplate(this.#path, data);
  }
}
