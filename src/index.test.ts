import * as Manifest from './Manifest';
import Module from './Module';
import * as index from './index';

jest.mock('./Manifest');
jest.mock('./Module');

it('exports Manifest', () => {
  expect(index.Manifest).toBe(Manifest);
});

it('exports Module', () => {
  expect(index.Module).toBe(Module);
});

it('exports only intended values', () => {
  const expectedKeys: string[] = [
    'Manifest',
    'Module',
  ];
  const keys = Object.keys(index);
  expect(keys).toEqual(expect.arrayContaining(expectedKeys));
  expect(keys).toHaveLength(expectedKeys.length);
});
