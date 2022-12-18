import { IllandrilAuthorInfo, generate } from './Manifest';

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
    expect(IllandrilAuthorInfo.discord).toBe('joespan#3152');
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
    expect(JSON.stringify(minimalExample, undefined, 2)).toBe(`{
  "id": "minimal-example",
  "title": "Minimal Example",
  "description": "My example module",
  "version": "1.2.3",
  "manifestPlusVersion": "1.2.0",
  "authors": [
    {
      "name": "John Q. Sample"
    }
  ],
  "compatibility": {
    "minimum": 11,
    "verified": 12
  },
  "url": "https://github.com/user/minimal-example",
  "bugs": "https://github.com/user/minimal-example/issues",
  "flags": {
    "allowBugReporter": true
  },
  "changelog": "https://github.com/user/minimal-example/blob/master/CHANGELOG.md",
  "manifest": "https://github.com/user/minimal-example/releases/latest/download/module.json",
  "download": "https://github.com/user/minimal-example/releases/download/v1.2.3/module.zip"
}`);
  });

  it('generates illandril-chat-enhancements as expected', () => {
    const chatEnhancements = generate({
      id: 'illandril-chat-enhancements',
      title: 'Illandril\'s Chat Enhancements',
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
          url: 'https://github.com/illandril/FoundryVTT-chat-enhancements/raw/master/screenshots/example-a.png',
        },
        {
          type: 'screenshot',
          url: 'https://github.com/illandril/FoundryVTT-chat-enhancements/raw/master/screenshots/example-preview.png',
        },
      ],
    });

    expect(JSON.stringify(chatEnhancements, undefined, 2)).toBe(`{
  "id": "illandril-chat-enhancements",
  "title": "Illandril's Chat Enhancements",
  "description": "Enhances the chat by showing...",
  "version": "2.0.0",
  "manifestPlusVersion": "1.2.0",
  "authors": [
    {
      "name": "Joe Spandrusyszyn (illandril)",
      "url": "https://github.com/illandril",
      "email": "foundry-modules@illandril.net",
      "discord": "joespan#3152",
      "ko-fi": "illandril",
      "patreon": "illandril",
      "reddit": "u/illandril"
    }
  ],
  "license": "./LICENSE",
  "compatibility": {
    "minimum": 10,
    "verified": 10
  },
  "esmodules": [
    "./module.js"
  ],
  "styles": [
    "./styles.css"
  ],
  "languages": [
    {
      "lang": "en",
      "name": "English",
      "path": "lang/en.json"
    },
    {
      "lang": "es",
      "name": "Español",
      "path": "lang/es.json"
    },
    {
      "lang": "zh-tw",
      "name": "正體中文",
      "path": "lang/zh-tw.json"
    }
  ],
  "url": "https://github.com/illandril/FoundryVTT-chat-enhancements",
  "bugs": "https://github.com/illandril/FoundryVTT-chat-enhancements/issues",
  "flags": {
    "allowBugReporter": true
  },
  "changelog": "https://github.com/illandril/FoundryVTT-chat-enhancements/blob/master/CHANGELOG.md",
  "manifest": "https://github.com/illandril/FoundryVTT-chat-enhancements/releases/latest/download/module.json",
  "download": "https://github.com/illandril/FoundryVTT-chat-enhancements/releases/download/v2.0.0/module.zip",
  "media": [
    {
      "type": "screenshot",
      "url": "https://github.com/illandril/FoundryVTT-chat-enhancements/raw/master/screenshots/example-a.png"
    },
    {
      "type": "screenshot",
      "url": "https://github.com/illandril/FoundryVTT-chat-enhancements/raw/master/screenshots/example-preview.png"
    }
  ]
}`);
  });
});
