import ModuleSocket from './ModuleSocket';

describe('missing game.socket', () => {
  let replacedSocket: jest.ReplaceProperty<typeof game.socket>;
  beforeAll(() => {
    replacedSocket = jest.replaceProperty(game, 'socket', null);
  });
  afterAll(() => {
    replacedSocket.restore();
  });

  it('emit throws a reasonable error if game.socket is missing', () => {
    const socket = new ModuleSocket('example-module');

    expect(() => {
      socket.emit({});
    }).toThrow('emit was called before game.socket was initialized or after it was torn down');
  });

  it('on throws a reasonable error if game.socket is missing', () => {
    const socket = new ModuleSocket('example-module');

    expect(() => {
      socket.on(() => {
        // noop
      });
    }).toThrow('on was called before game.socket was initialized or after it was torn down');
  });
});

describe('emit', () => {
  const emit = jest.mocked(game.socket?.emit);

  it('calls game.socket.emit', () => {
    const socket = new ModuleSocket('example-module');

    expect(emit).toHaveBeenCalledTimes(0);

    socket.emit({});

    expect(emit).toHaveBeenCalledTimes(1);

    socket.emit({});

    expect(emit).toHaveBeenCalledTimes(2);
  });

  it.each(['example-module', 'illandril-grid-labels'])(
    'passes the correct key ("module.%s") to game.socket.emit',
    (id) => {
      const socket = new ModuleSocket(id);

      socket.emit({});

      expect(emit).toHaveBeenCalledWith(`module.${id}`, {});
      expect(emit).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    {},
    {
      id: '123',
      type: 0,
      payload: {
        value: true,
      },
    },
    {
      id: '456',
      type: 1,
      payload: {
        value: false,
      },
    },
  ])('passes the provided data (%j) to game.socket.emit', (data) => {
    const socket = new ModuleSocket('example-module');

    expect(emit).toHaveBeenCalledTimes(0);

    socket.emit(data);

    expect(emit).toHaveBeenCalledWith('module.example-module', data);
  });
});

describe('on', () => {
  const on = jest.mocked(game.socket?.on);

  it('calls game.socket.on', () => {
    const socket = new ModuleSocket('example-module');

    expect(on).toHaveBeenCalledTimes(0);

    socket.on(() => {
      // noop
    });

    expect(on).toHaveBeenCalledTimes(1);

    socket.on(() => {
      // noop
    });

    expect(on).toHaveBeenCalledTimes(2);
  });

  it.each(['example-module', 'illandril-grid-labels'])(
    'passes the correct key ("module.%s") to game.socket.on',
    (id) => {
      const socket = new ModuleSocket(id);

      const callback = () => {
        // noop
      };
      socket.on(callback);

      expect(on).toHaveBeenCalledWith(`module.${id}`, callback);
      expect(on).toHaveBeenCalledTimes(1);
    },
  );

  it('passes the provided callback to game.socket.on', () => {
    const socket = new ModuleSocket('example-module');

    const callback1 = () => {
      // noop
    };
    const callback2 = () => {
      // noop
    };

    expect(on).toHaveBeenCalledTimes(0);

    socket.on(callback1);

    expect(on).toHaveBeenCalledTimes(1);
    expect(on).toHaveBeenCalledWith('module.example-module', callback1);
    expect(on).not.toHaveBeenCalledWith('module.example-module', callback2);

    socket.on(callback2);

    expect(on).toHaveBeenCalledTimes(2);
    expect(on).toHaveBeenCalledWith('module.example-module', callback2);
  });

  it('SIMULATE.socketEmit triggers the correct callback(s)', () => {
    const exampleSocket = new ModuleSocket('example-module');
    const exampleCallback = jest.fn();
    exampleSocket.on(exampleCallback);

    const gridLabelsSocket = new ModuleSocket('illandril-grid-labels');
    const glCallback1 = jest.fn();
    const glCallback2 = jest.fn();
    const glCallback3 = jest.fn();
    gridLabelsSocket.on(glCallback1);
    gridLabelsSocket.on(glCallback2);
    gridLabelsSocket.on(glCallback3);

    expect(exampleCallback).toHaveBeenCalledTimes(0);
    expect(glCallback1).toHaveBeenCalledTimes(0);
    expect(glCallback2).toHaveBeenCalledTimes(0);
    expect(glCallback3).toHaveBeenCalledTimes(0);

    const data1 = { id: 1 };
    const data2 = { id: 2 };
    const data3 = { id: 3 };

    SIMULATE.socketEmit('module.example-module', data1);
    expect(exampleCallback).toHaveBeenCalledTimes(1);
    expect(exampleCallback).toHaveBeenCalledWith(data1);
    expect(glCallback1).toHaveBeenCalledTimes(0);
    expect(glCallback2).toHaveBeenCalledTimes(0);
    expect(glCallback3).toHaveBeenCalledTimes(0);

    SIMULATE.socketEmit('module.illandril-grid-labels', data2);
    expect(exampleCallback).toHaveBeenCalledTimes(1);
    expect(glCallback1).toHaveBeenCalledTimes(1);
    expect(glCallback2).toHaveBeenCalledTimes(1);
    expect(glCallback3).toHaveBeenCalledTimes(1);
    expect(glCallback1).toHaveBeenCalledWith(data2);
    expect(glCallback2).toHaveBeenCalledWith(data2);
    expect(glCallback3).toHaveBeenCalledWith(data2);

    SIMULATE.socketEmit('module.example-module', data3);
    expect(exampleCallback).toHaveBeenCalledTimes(2);
    expect(exampleCallback).toHaveBeenCalledWith(data3);
    expect(glCallback1).toHaveBeenCalledTimes(1);
    expect(glCallback2).toHaveBeenCalledTimes(1);
    expect(glCallback3).toHaveBeenCalledTimes(1);
  });
});
