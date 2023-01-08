game.i18n.localize = (key) => `mock-localize[${key}]`;
game.i18n.format = (key, args) => `mock-format[${key}][${JSON.stringify(args)}]`;
