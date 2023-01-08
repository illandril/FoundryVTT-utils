// eslint-disable-next-line @typescript-eslint/require-await
window.getTemplate = async (path: string) => () => {
  throw new Error(`Template (${JSON.stringify(path)}) was rendered directly`);
};

// eslint-disable-next-line @typescript-eslint/require-await
window.renderTemplate = async (path: string, data: unknown) => {
  return `Mock Render Template path=${JSON.stringify(path)} data=${JSON.stringify(data)}`;
};
