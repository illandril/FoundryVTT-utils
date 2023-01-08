import Module from './Module';

const module = new Module({
  id: 'template-test', title: 'Template Test Module', version: '1.2.3',
});

it('should call getTemplate immediately', () => {
  const getTemplateSpy = jest.spyOn(window, 'getTemplate');

  expect(getTemplateSpy).not.toBeCalled();

  module.registerTemplate('testTemplate.html');

  expect(getTemplateSpy).toBeCalledTimes(1);
  expect(getTemplateSpy).toBeCalledWith('modules/template-test/templates/testTemplate.html');
});

it('should call renderTempalte on render', async () => {
  const renderTemplateSpy = jest.spyOn(window, 'renderTemplate');

  const template = module.registerTemplate<{ example: string }>('testTemplate.html');
  const data = {
    example: 'value',
  };

  expect(renderTemplateSpy).not.toBeCalled();

  await template.render(data);

  expect(renderTemplateSpy).toBeCalledTimes(1);
  expect(renderTemplateSpy).toBeCalledWith('modules/template-test/templates/testTemplate.html', data);
});
