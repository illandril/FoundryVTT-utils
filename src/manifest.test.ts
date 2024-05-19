import { IllandrilAuthorInfo, generate } from './manifest';

describe('IllandrilAuthorInfo', () => {
  it('has the correct name', () => {
    expect(IllandrilAuthorInfo.name).toBe('Joe Spandrusyszyn (illandril)');
  });
  it('has the correct url', () => {
    expect(IllandrilAuthorInfo.url).toBe('https://github.com/illandril');
  });
  it('has the correct email', () => {
    expect(IllandrilAuthorInfo.email).toBe('foundry-modules@illandril.net');
  });
  it('has the correct discord', () => {
    expect(IllandrilAuthorInfo.discord).toBe('joespan');
  });
  it('has the correct ko-fi', () => {
    expect(IllandrilAuthorInfo['ko-fi']).toBe('illandril');
  });
  it('has the correct patreon', () => {
    expect(IllandrilAuthorInfo.patreon).toBe('illandril');
  });
  it('has the correct reddit', () => {
    expect(IllandrilAuthorInfo.reddit).toBe('u/illandril');
  });
});

describe('getStandardFields', () => {
  it('generates minimal-example as expected', () => {
    const minimalExample = generate({
      id: 'minimal-example',
      title: 'Minimal Example',
      description: 'My example module',
      version: '1.2.3',
      compatibility: {
        minimum: 11,
        verified: 12,
      },
      authors: [{ name: 'John Q. Sample' }],
      repositoryURL: 'git+https://github.com/user/minimal-example.git',
    });
    expect(minimalExample).toEqual({
      id: 'minimal-example',
      title: 'Minimal Example',
      description: 'My example module',
      version: '1.2.3',
      manifestPlusVersion: '1.2.0',
      authors: [
        {
          name: 'John Q. Sample',
        },
      ],
      compatibility: {
        minimum: 11,
        verified: 12,
      },
      url: 'https://github.com/user/minimal-example',
      bugs: 'https://github.com/user/minimal-example/issues',
      flags: {
        allowBugReporter: true,
      },
      changelog: 'https://github.com/user/minimal-example/releases',
      manifest: 'https://github.com/user/minimal-example/releases/latest/download/module.json',
      download: 'https://github.com/user/minimal-example/releases/download/v1.2.3/module.zip',
    });
  });

  it('generates illandril-chat-enhancements as expected', () => {
    const chatEnhancements = generate({
      id: 'illandril-chat-enhancements',
      title: "Illandril's Chat Enhancements",
      description: 'Enhances the chat by showing...',
      version: '2.0.0',
      compatibility: {
        minimum: 10,
        verified: 10,
      },
      authors: [IllandrilAuthorInfo],
      esmodules: ['./module.js'],
      styles: ['./styles.css'],
      languages: [
        { lang: 'en', name: 'English', path: 'lang/en.json' },
        { lang: 'es', name: 'Español', path: 'lang/es.json' },
        { lang: 'zh-tw', name: '正體中文', path: 'lang/zh-tw.json' },
      ],
      license: './LICENSE',
      repositoryURL: 'git+https://github.com/illandril/FoundryVTT-chat-enhancements.git',
      media: [
        {
          type: 'screenshot',
          url: 'https://github.com/illandril/FoundryVTT-chat-enhancements/raw/main/screenshots/example-a.png',
        },
        {
          type: 'screenshot',
          url: 'https://github.com/illandril/FoundryVTT-chat-enhancements/raw/main/screenshots/example-preview.png',
        },
      ],
    });

    expect(chatEnhancements).toEqual({
      id: 'illandril-chat-enhancements',
      title: "Illandril's Chat Enhancements",
      description: 'Enhances the chat by showing...',
      version: '2.0.0',
      manifestPlusVersion: '1.2.0',
      authors: [
        {
          name: 'Joe Spandrusyszyn (illandril)',
          url: 'https://github.com/illandril',
          email: 'foundry-modules@illandril.net',
          discord: 'joespan',
          'ko-fi': 'illandril',
          patreon: 'illandril',
          reddit: 'u/illandril',
        },
      ],
      license: './LICENSE',
      compatibility: {
        minimum: 10,
        verified: 10,
      },
      esmodules: ['./module.js'],
      styles: ['./styles.css'],
      languages: [
        {
          lang: 'en',
          name: 'English',
          path: 'lang/en.json',
        },
        {
          lang: 'es',
          name: 'Español',
          path: 'lang/es.json',
        },
        {
          lang: 'zh-tw',
          name: '正體中文',
          path: 'lang/zh-tw.json',
        },
      ],
      url: 'https://github.com/illandril/FoundryVTT-chat-enhancements',
      bugs: 'https://github.com/illandril/FoundryVTT-chat-enhancements/issues',
      flags: {
        allowBugReporter: true,
      },
      changelog: 'https://github.com/illandril/FoundryVTT-chat-enhancements/releases',
      manifest: 'https://github.com/illandril/FoundryVTT-chat-enhancements/releases/latest/download/module.json',
      download: 'https://github.com/illandril/FoundryVTT-chat-enhancements/releases/download/v2.0.0/module.zip',
      media: [
        {
          type: 'screenshot',
          url: 'https://github.com/illandril/FoundryVTT-chat-enhancements/raw/main/screenshots/example-a.png',
        },
        {
          type: 'screenshot',
          url: 'https://github.com/illandril/FoundryVTT-chat-enhancements/raw/main/screenshots/example-preview.png',
        },
      ],
    });
  });

  it.each([
    ['id', 'example-id-1'],
    ['id', 'other-id'],

    ['title', 'Example Module'],
    ['title', 'Some Title'],

    ['description', 'Lorem ipsum dolor sit'],
    ['description', 'The coolest module ever'],

    ['version', '1.2.3'],
    ['version', '2.0.1'],
    ['version', '3.4.5'],

    ['compatibility', { minimum: 11, verified: 12 }],
    ['compatibility', { minimum: 13, verified: 13 }],
    ['compatibility', { minimum: 10, verified: 11, maximum: 11 }],

    [
      'authors',
      [
        {
          name: 'Author 1',
          url: 'https://author.example.com',
          email: 'author@example.com',
          discord: 'author-discord',
          'ko-fi': 'author-kofi',
          patreon: 'author-patreon',
          reddit: 'author-reddit',
          twitter: 'author-twitter',
        },
      ],
    ],
    [
      'authors',
      [
        {
          name: 'Author 1',
          url: 'https://author1.example.com',
        },
        {
          name: 'Author 2',
          email: 'author2@example.com',
        },
        {
          name: 'Author 3',
          url: 'https://author3.example.com',
        },
      ],
    ],

    ['relationships', undefined],
    ['relationships', {}],
    [
      'relationships',
      {
        systems: [
          {
            id: 'mock-system-rel',
            type: 'system',
          },
        ],
      },
    ],
    [
      'relationships',
      {
        modules: [
          {
            id: 'mock-module-rel',
            type: 'module',
          },
        ],
      },
    ],
    [
      'relationships',
      {
        systems: [
          {
            id: 'mock-system-rel',
            type: 'system',
          },
        ],
        modules: [
          {
            id: 'mock-module-rel',
            type: 'module',
          },
        ],
      },
    ],

    ['library', undefined],
    ['library', true],
    ['library', false],

    ['socket', undefined],
    ['socket', true],
    ['socket', false],

    ['esmodules', undefined],
    ['esmodules', ['module.js']],
    ['esmodules', ['mod1.js', 'mod2.js']],

    ['styles', undefined],
    ['styles', ['styles.css']],
    ['styles', ['style1.css', 'style2.css']],

    ['packs', undefined],

    ['languages', undefined],
    [
      'languages',
      [
        {
          lang: 'en',
          name: 'English',
          path: 'lang/en.json',
        },
      ],
    ],
    [
      'languages',
      [
        {
          lang: 'ja',
          name: '日本語',
          path: 'lang/ja.json',
        },
      ],
    ],
    [
      'languages',
      [
        {
          lang: 'en',
          name: 'English',
          path: 'lang/en.json',
        },
        {
          lang: 'ja',
          name: '日本語',
          path: 'lang/ja.json',
        },
      ],
    ],

    ['license', undefined],
    ['license', 'LICENSE'],
    ['license', 'MIT'],

    ['readme', undefined],
    ['readme', 'README.md'],
    ['readme', 'notes.txt'],

    ['media', undefined],
    [
      'media',
      [
        {
          type: 'cover',
          url: 'https://example.com/cover.jpg',
        },
      ],
    ],
    [
      'media',
      [
        {
          type: 'cover',
          url: 'https://example.com/cover.jpg',
        },
        {
          type: 'screenshot',
          url: 'https://example.com/example-a.png',
        },
        {
          type: 'screenshot',
          url: 'https://example.com/example-b.png',
        },
      ],
    ],
    // media?: NonEmptyArray<MediaOptions>;
  ] as const)('supports %s=%j', (key, value) => {
    const manifest = generate({
      id: 'mock-id',
      title: 'mock-title',
      description: 'mock-description',
      version: '1.2.3',
      compatibility: {
        minimum: 11,
        verified: 12,
      },
      authors: [{ name: 'John Q. Sample' }],
      repositoryURL: 'git+https://github.com/user/field-example.git',
      [key]: value === undefined ? value : JSON.parse(JSON.stringify(value)),
    });

    expect(manifest[key]).toEqual(value);
  });
});
