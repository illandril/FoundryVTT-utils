import CSSPrefix from './CSSPrefix';

describe('validation', () => {
  const expectedErrorMessage =
    'CSS prefixes must be at least two characters, start and end with a letter or "_", and contain only letters, numbers, "_", or "-"';

  const validStartingCharacters: Readonly<string[]> = [...'abcdefghijklmnopqrstuvwxyz_'];
  const validEndingCharacters: Readonly<string[]> = [...validStartingCharacters, ...'0123456789'];
  const validMiddleCharacters: Readonly<string[]> = [...validEndingCharacters, '-'];
  const invalidMiddleCharacters: Readonly<string[]> = [...'~`!@#$%^&*()+={}[]|\\:;"\',.<>/?'];
  const invalidEndingCharacters: Readonly<string[]> = [...invalidMiddleCharacters, ...'-'];
  const invalidStartingCharacters: Readonly<string[]> = [...invalidEndingCharacters, ...'0123456789'];

  describe('constructor', () => {
    it.each(validStartingCharacters)('throws if prefix is too short (%s)', (character) => {
      expect(() => {
        new CSSPrefix(character);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validStartingCharacters)('allows two-character prefix (double %s)', (character) => {
      const prefix = `${character}${character}`;
      const cssPrefix = new CSSPrefix(prefix);
      const value = cssPrefix.child('value');
      expect(value).toBe(`${prefix}--value`);
    });

    it.each(validStartingCharacters)('allows prefix to start with %s', (character) => {
      const prefix = `${character}a`;
      const cssPrefix = new CSSPrefix(prefix);
      const value = cssPrefix.child('value');
      expect(value).toBe(`${prefix}--value`);
    });

    it.each(invalidStartingCharacters)('throws if prefix starts with %s', (character) => {
      expect(() => {
        new CSSPrefix(`${character}a`);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validEndingCharacters)('allows prefix to end with %s', (character) => {
      const prefix = `a${character}`;
      const cssPrefix = new CSSPrefix(prefix);
      const value = cssPrefix.child('value');
      expect(value).toBe(`${prefix}--value`);
    });

    it.each(invalidEndingCharacters)('throws if prefix ends with %s', (character) => {
      expect(() => {
        new CSSPrefix(`a${character}`);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validMiddleCharacters)('allows prefix to contain %s', (character) => {
      const prefix = `a${character}a`;
      const cssPrefix = new CSSPrefix(prefix);
      const value = cssPrefix.child('value');
      expect(value).toBe(`${prefix}--value`);
    });

    it.each(invalidMiddleCharacters)('throws if prefix contains %s', (character) => {
      expect(() => {
        new CSSPrefix(`a${character}a`);
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('.childPrefix', () => {
    const parent = new CSSPrefix('aa');

    it.each(validStartingCharacters)('throws if section is too short (%s)', (character) => {
      expect(() => {
        parent.childPrefix(character);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validStartingCharacters)('allows two-character section (double %s)', (character) => {
      const section = `${character}${character}`;
      const cssPrefix = parent.childPrefix(section);
      const value = cssPrefix.child('value');
      expect(value).toBe(`aa--${section}--value`);
    });

    it.each(validStartingCharacters)('allows section to start with %s', (character) => {
      const section = `${character}a`;
      const cssPrefix = parent.childPrefix(section);
      const value = cssPrefix.child('value');
      expect(value).toBe(`aa--${section}--value`);
    });

    it.each(invalidStartingCharacters)('throws if section starts with %s', (character) => {
      expect(() => {
        parent.childPrefix(`${character}a`);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validEndingCharacters)('allows section to end with %s', (character) => {
      const section = `a${character}`;
      const cssPrefix = parent.childPrefix(section);
      const value = cssPrefix.child('value');
      expect(value).toBe(`aa--${section}--value`);
    });

    it.each(invalidEndingCharacters)('throws if section ends with %s', (character) => {
      expect(() => {
        parent.childPrefix(`a${character}`);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validMiddleCharacters)('allows section to contain %s', (character) => {
      const section = `a${character}a`;
      const cssPrefix = parent.childPrefix(section);
      const value = cssPrefix.child('value');
      expect(value).toBe(`aa--${section}--value`);
    });

    it.each(invalidMiddleCharacters)('throws if section contains %s', (character) => {
      expect(() => {
        parent.childPrefix(`a${character}a`);
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('.child', () => {
    const parent = new CSSPrefix('aa');

    it.each(validStartingCharacters)('throws if suffix is too short (%s)', (character) => {
      expect(() => {
        parent.child(character);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validStartingCharacters)('allows two-character suffix (double %s)', (character) => {
      const suffix = `${character}${character}`;
      const value = parent.child(suffix);
      expect(value).toBe(`aa--${suffix}`);
    });

    it.each(validStartingCharacters)('allows suffix to start with %s', (character) => {
      const suffix = `${character}a`;
      const value = parent.child(suffix);
      expect(value).toBe(`aa--${suffix}`);
    });

    it.each(invalidStartingCharacters)('throws if suffix starts with %s', (character) => {
      expect(() => {
        parent.child(`${character}a`);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validEndingCharacters)('allows suffix to end with %s', (character) => {
      const suffix = `a${character}`;
      const value = parent.child(suffix);
      expect(value).toBe(`aa--${suffix}`);
    });

    it.each(invalidEndingCharacters)('throws if suffix ends with %s', (character) => {
      expect(() => {
        parent.child(`a${character}`);
      }).toThrowError(expectedErrorMessage);
    });

    it.each(validMiddleCharacters)('allows suffix to contain %s', (character) => {
      const suffix = `a${character}a`;
      const value = parent.child(suffix);
      expect(value).toBe(`aa--${suffix}`);
    });

    it.each(invalidMiddleCharacters)('throws if suffix contains %s', (character) => {
      expect(() => {
        parent.child(`a${character}a`);
      }).toThrowError(expectedErrorMessage);
    });
  });
});

it('allows extreme nesting', () => {
  const root = new CSSPrefix('root-prefix');
  const deepPrefix = root
    .childPrefix('c1')
    .childPrefix('c2')
    .childPrefix('c3')
    .childPrefix('c4')
    .childPrefix('c5')
    .childPrefix('c6')
    .childPrefix('c7')
    .childPrefix('c8')
    .childPrefix('c9')
    .childPrefix('c10');
  const deepChild = deepPrefix.child('value');
  expect(deepChild).toBe('root-prefix--c1--c2--c3--c4--c5--c6--c7--c8--c9--c10--value');
});

describe('example-module', () => {
  const examplePrefix = new CSSPrefix('example-module');

  describe('.child', () => {
    it('returns the correct value for "child1"', () => {
      const value = examplePrefix.child('child1');
      expect(value).toBe('example-module--child1');
    });
    it('returns the correct value for "child-two"', () => {
      const value = examplePrefix.child('child-two');
      expect(value).toBe('example-module--child-two');
    });
  });

  describe('.childPrefix', () => {
    describe('group1', () => {
      const group1 = examplePrefix.childPrefix('group1');

      describe('.child', () => {
        it('returns the correct value for "child1"', () => {
          const value = group1.child('child1');
          expect(value).toBe('example-module--group1--child1');
        });
        it('returns the correct value for "child-two"', () => {
          const value = group1.child('child-two');
          expect(value).toBe('example-module--group1--child-two');
        });
      });
    });

    describe('group-two', () => {
      const group2 = examplePrefix.childPrefix('group-two');

      describe('.child', () => {
        it('returns the correct value for "child1"', () => {
          const value = group2.child('child1');
          expect(value).toBe('example-module--group-two--child1');
        });
        it('returns the correct value for "child-two"', () => {
          const value = group2.child('child-two');
          expect(value).toBe('example-module--group-two--child-two');
        });
      });
    });
  });
});

describe('illandril-hotbar-uses', () => {
  const ihuPrefix = new CSSPrefix('illandril-hotbar-uses');

  describe('.child', () => {
    it('returns the correct value for "counter"', () => {
      const value = ihuPrefix.child('counter');
      expect(value).toBe('illandril-hotbar-uses--counter');
    });
    it('returns the correct value for "hasUses"', () => {
      const value = ihuPrefix.child('hasUses');
      expect(value).toBe('illandril-hotbar-uses--hasUses');
    });
  });
});

describe('illandril-token-tootlips', () => {
  const ittCSSPrefix = new CSSPrefix('illandril-token-tooltips');

  describe('.childPrefix', () => {
    describe('customOptionForm', () => {
      const cofPrefix = ittCSSPrefix.childPrefix('customOptionForm');

      describe('.child', () => {
        it('returns the correct value for "title"', () => {
          const value = cofPrefix.child('title');
          expect(value).toBe('illandril-token-tooltips--customOptionForm--title');
        });
        it('returns the correct value for "actions"', () => {
          const value = cofPrefix.child('actions');
          expect(value).toBe('illandril-token-tooltips--customOptionForm--actions');
        });
      });

      describe('.childPrefix > toggleDebug', () => {
        const tdPrefix = cofPrefix.childPrefix('toggleDebug');

        it('returns the correct value for "on"', () => {
          const value = tdPrefix.child('on');
          expect(value).toBe('illandril-token-tooltips--customOptionForm--toggleDebug--on');
        });
        it('returns the correct value for "off"', () => {
          const value = tdPrefix.child('off');
          expect(value).toBe('illandril-token-tooltips--customOptionForm--toggleDebug--off');
        });
      });
    });

    describe('tooltip', () => {
      const ttPrefix = ittCSSPrefix.childPrefix('tooltip');

      describe('.child', () => {
        it('returns the correct value for "row"', () => {
          const value = ttPrefix.child('row');
          expect(value).toBe('illandril-token-tooltips--tooltip--row');
        });
        it('returns the correct value for "value"', () => {
          const value = ttPrefix.child('value');
          expect(value).toBe('illandril-token-tooltips--tooltip--value');
        });
        it('returns the correct value for "value"', () => {
          const value = ttPrefix.child('value');
          expect(value).toBe('illandril-token-tooltips--tooltip--value');
        });
        it('returns the correct value for "value"', () => {
          const value = ttPrefix.child('value');
          expect(value).toBe('illandril-token-tooltips--tooltip--value');
        });
        it('returns the correct value for "value"', () => {
          const value = ttPrefix.child('value');
          expect(value).toBe('illandril-token-tooltips--tooltip--value');
        });
      });
    });
  });
});
