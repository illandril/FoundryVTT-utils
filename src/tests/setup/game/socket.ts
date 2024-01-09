(game as { socket: typeof game['socket'] }).socket = {
  emit: jest.fn(),
  on: jest.fn(),
};

declare global {
  interface SIMULATE {
    socketEmit: (key: string, data: object) => void
  }
}

SIMULATE.socketEmit = (key, data) => {
  for (const call of jest.mocked(game.socket!.on).mock.calls) {
    if (call[0] === key) {
      call[1](data);
    }
  }
};

export {};
