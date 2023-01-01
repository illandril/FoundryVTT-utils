import Module from './Module';
import Settings from './Settings';

jest.mock('./Settings');

describe('settings', () => {
  it.each([
    'example-module',
    'illandril-chat-enhancements',
    'illandril-token-tooltips',
  ])('passes module id (%s) to Settings', (id) => {
    const module = new Module({
      id,
      title: 'Example Module',
      version: '1.0.0',
    });
    const settings = module.settings;

    expect(Settings).toBeCalledTimes(1);
    expect(Settings).toBeCalledWith(id, module.localize);
    expect(settings).toBeInstanceOf(Settings);
  });
});
