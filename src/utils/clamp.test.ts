import clamp from './clamp';

it.each<[number, number, number, number]>([
  [0, 0, 0, 10],
  [0, -1, 0, 10],
  [1, 1, 0, 10],
  [2, 2, 0, 10],
  [5, 5, 0, 10],
  [8, 8, 0, 10],
  [9, 9, 0, 10],
  [10, 10, 0, 10],
  [10, 11, 0, 10],
  [11, 11, 0, 100],
  [100, 101, 0, 100],
  [-1, -1, -10, 10],
  [-10, -11, -10, 10],
])('returns %j for clamp(%j, %j, %j)', (expected, num, min, max) => {
  const actual = clamp(num, min, max);
  expect(actual).toBe(expected);
});
