import { toInt } from './index';

it.each([
  // Non-numeric input
  [undefined, NaN],
  [null, NaN],
  [NaN, NaN],
  ['', NaN],
  ['no', NaN],

  // Positive integers
  [1, 1],
  ['1', 1],
  [2, 2],
  ['2', 2],
  [5, 5],
  ['5', 5],
  [10, 10],
  ['10', 10],
  [675467543, 675467543],
  ['675467543', 675467543],

  // Negative Integers
  [-1, -1],
  ['-1', -1],
  [-2, -2],
  ['-2', -2],
  [-10, -10],
  ['-10', -10],
  [-678543236, -678543236],
  ['-678543236', -678543236],

  // Postive decimals rounded down
  [0.1, 0],
  ['0.1', 0],
  [0.9, 0],
  ['0.9', 0],
  [1.1, 1],
  ['1.1', 1],
  [1.9, 1],
  ['1.9', 1],
  [2.1, 2],
  ['2.1', 2],
  [2.9, 2],
  ['2.9', 2],

  // Negative decimals rounded down
  [-2.9, -2],
  ['-2.9', -2],
  [-2.1, -2],
  ['-2.1', -2],
  [-1.9, -1],
  ['-1.9', -1],
  [-1.1, -1],
  ['-1.1', -1],
  [-0.9, 0],
  ['-0.9', 0],
  [-0.1, 0],
  ['-0.1', 0],
])('toInt(%j) returns %i', (input, expectedOutput) => {
  const result = toInt(input);
  expect(result).toBe(expectedOutput);
});
