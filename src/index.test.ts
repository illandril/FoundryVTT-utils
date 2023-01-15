import * as Manifest from './Manifest';
import ModuleUtils from './ModuleUtils';
import * as utils from './utils';
import * as index from './index';

jest.mock('./Manifest');
jest.mock('./ModuleUtils');

it('exports Manifest', () => {
  expect(index.Manifest).toBe(Manifest);
});

it('exports Module', () => {
  expect(index.ModuleUtils).toBe(ModuleUtils);
});

it.each(Object.keys(utils) as (keyof typeof utils)[])('exports utils.%s', (key) => {
  // eslint-disable-next-line import/namespace
  expect(index[key]).toBe(utils[key]);
});

it('exports only intended values', () => {
  const expectedKeys: string[] = [
    'Manifest',
    'ModuleUtils',
    ...Object.keys(utils),
  ];
  const keys = Object.keys(index);
  expect(keys).toEqual(expect.arrayContaining(expectedKeys));
  expect(keys).toHaveLength(expectedKeys.length);
});
