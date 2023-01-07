const toInt = (value: string | number | null | undefined) => {
  let result;
  if (typeof value === 'string') {
    result = parseInt(value, 10);
  } else if (typeof value === 'number') {
    // This is equivalent to what parseInt(`{number}`, 10) would do
    result = value > 0 ? Math.floor(value) : Math.ceil(value);
  } else {
    result = NaN;
  }
  // Convert `-0` to `0`
  return result === 0 ? 0 : result;
};

export default toInt;
