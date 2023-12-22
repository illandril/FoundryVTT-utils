export default {
  vtt: '@illandril/foundryvtt-utils Test',
  SIMULATE: {},
  game: {
    canvas: {
      ready: false,
    },
    i18n: {},
    keybindings: {},
    scenes: {
      current: {
        name: 'Mock Scene',
        grid: {
          type: 1,
          size: 140,
          distance: 5,
          units: 'ft',
        },
        dimensions: {
          width: 7420,
          height: 10640,
          size: 140,
        },
      },
    },
    settings: {},
    userId: 'mock-user-id',
    user: {
      id: 'mock-user-id',
      name: 'Mock User',
      isGM: false,
    },
  },
  ui: {
    notifications: {},
    hotbar: {},
  },
  Hooks: {},
  foundry: {
    CONST: {
      CHAT_MESSAGE_TYPES: {
        OTHER: 0,
        OOC: 1,
        IC: 2,
        EMOTE: 3,
        WHISPER: 4,
        ROLL: 5,
      },
      DEFAULT_TOKEN: 'icons/svg/mock-default.svg',
      DOCUMENT_OWNERSHIP_LEVELS: {
        INHERIT: -1,
        NONE: 0,
        LIMITED: 1,
        OBSERVER: 2,
        OWNER: 3,
      },
      DRAWING_TYPES: {
        RECTANGLE: 'r',
        ELLIPSE: 'e',
        TEXT: 't',
        POLYGON: 'p',
        FREEHAND: 'f',
      },
      GRID_MIN_SIZE: 50,
      GRID_TYPES: {
        GRIDLESS: 0,
        SQUARE: 1,
        HEXODDR: 2,
        HEXEVENR: 3,
        HEXODDQ: 4,
        HEXEVENQ: 5,
      },
      KEYBINDING_PRECEDENCE: {
        PRIORITY: 0,
        NORMAL: 1,
        DEFERRED: 2,
      },
      MACRO_TYPES: {
        SCRIPT: 'script',
        CHAT: 'chat',
      },
      SORT_INTEGER_DENSITY: 100000,
      TOKEN_DISPOSITIONS: {
        SECRET: -2,
        HOSTILE: -1,
        NEUTRAL: 0,
        FRIENDLY: 1,
      },
      USER_ROLES: {
        NONE: 0,
        PLAYER: 1,
        TRUSTED: 2,
        ASSISTANT: 3,
        GAMEMASTER: 4,
      },
    },
    utils: {},
  },
  KeyboardManager: {
    MODIFIER_KEYS: {
      CONTROL: 'Control',
      SHIFT: 'Shift',
      ALT: 'Alt',
    },
  },
  ChatMessage: {},
  dnd5e: {
    config: {
      hitDieTypes: ['d4', 'd6', 'd8', 'd10', 'd12'],
      maxLevel: 20,
      spellProgression: {
        none: 'None',
        full: 'Full Caster',
        half: 'Half Caster',
        third: 'Third Caster',
        pact: 'Pact Magic',
        artificer: 'Artificer',
      },
    },
  },
};
