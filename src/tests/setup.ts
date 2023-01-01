// Silence debug and info logging by default
jest.spyOn(console, 'debug').mockImplementation(() => undefined);
jest.spyOn(console, 'info').mockImplementation(() => undefined);
