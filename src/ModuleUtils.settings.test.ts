import Settings from './ModuleSettings';
import ModuleUtils from './ModuleUtils';

jest.mock('./ModuleSettings');

describe('settings', () => {
  it.each([
    'example-module',
    'illandril-chat-enhancements',
    'illandril-token-tooltips',
  ])('passes module id (%s) to Settings', (id) => {
    const module = new ModuleUtils({
      id,
      title: 'Example Module',
      version: '1.0.0',
    });
    const settings = module.settings;

    expect(Settings).toHaveBeenCalledTimes(1);
    expect(Settings).toHaveBeenCalledWith(id, module.localize);
    expect(settings).toBeInstanceOf(Settings);
  });
});
