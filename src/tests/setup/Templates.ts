window.getTemplate = async (path: string) => () => {
  throw new Error(`Template (${JSON.stringify(path)}) was rendered directly`);
};

window.renderTemplate = (path: string, data: unknown) => {
  return Promise.resolve(`Mock Render Template path=${JSON.stringify(path)} data=${JSON.stringify(data)}`);
};
