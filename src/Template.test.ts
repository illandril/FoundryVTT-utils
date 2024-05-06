import ModuleUtils from './ModuleUtils';

const module = new ModuleUtils({
  id: 'template-test',
  title: 'Template Test Module',
  version: '1.2.3',
});

it('should call getTemplate on init', () => {
  const getTemplateSpy = jest.spyOn(window, 'getTemplate');

  module.registerTemplate('testTemplate.html');

  expect(getTemplateSpy).not.toHaveBeenCalled();

  Hooks.callAll('init');

  expect(getTemplateSpy).toHaveBeenCalledTimes(1);
  expect(getTemplateSpy).toHaveBeenCalledWith('modules/template-test/templates/testTemplate.html');
});

it('should call renderTempalte on render', async () => {
  const renderTemplateSpy = jest.spyOn(window, 'renderTemplate');

  const template = module.registerTemplate<{ example: string }>('testTemplate.html');
  const data = {
    example: 'value',
  };

  expect(renderTemplateSpy).not.toHaveBeenCalled();

  await template.render(data);

  expect(renderTemplateSpy).toHaveBeenCalledTimes(1);
  expect(renderTemplateSpy).toHaveBeenCalledWith('modules/template-test/templates/testTemplate.html', data);
});
