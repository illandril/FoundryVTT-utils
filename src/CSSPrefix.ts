const validationPattern = /^[a-z_][a-z0-9\-_]*[a-z0-9_]$/i;

const assertValidPrefixSection = (value: string) => {
  if (!validationPattern.test(value)) {
    throw new Error(
      'CSS prefixes must be at least two characters, start and end with a letter or "_", and contain only letters, numbers, "_", or "-"',
    );
  }
};

export default class CSSPrefix {
  #prefix: string;

  constructor(prefix: string) {
    assertValidPrefixSection(prefix);
    this.#prefix = `${prefix}--`;
  }

  child(suffix: string) {
    assertValidPrefixSection(suffix);
    return `${this.#prefix}${suffix}`;
  }

  childPrefix(section: string) {
    assertValidPrefixSection(section);
    return new CSSPrefix(this.child(section));
  }
}
