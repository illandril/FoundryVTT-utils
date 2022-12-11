import Module from './Module';
import * as index from './index';

jest.mock('./Module');

it('exports Module', () => {
  expect(index.Module).toBe(Module);
});

it('exports only intended values', () => {
  const expectedKeys: string[] = [
    'Module',
  ];
  const keys = Object.keys(index);
  expect(keys).toEqual(expect.arrayContaining(expectedKeys));
  expect(keys).toHaveLength(expectedKeys.length);
});
