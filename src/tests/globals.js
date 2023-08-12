export default {
  vtt: '@illandril/foundryvtt-utils Test',
  game: {
    canvas: {
      ready: false,
    },
    i18n: {},
    scenes: {},
    settings: {},
    userId: 'mock-user-id',
  },
  ui: {
    notifications: {},
  },
  Hooks: {},
  foundry: {
    CONST: {
      DEFAULT_TOKEN: 'icons/svg/mock-default.svg',
      GRID_MIN_SIZE: 50,
      SORT_INTEGER_DENSITY: 100000,
    },
    utils: {},
  },
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
