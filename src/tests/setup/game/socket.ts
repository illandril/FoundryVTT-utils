const emit = jest.fn();
const on = jest.fn();

(game as { socket: (typeof game)['socket'] }).socket = {
  emit,
  on,
};

declare global {
  interface Simulate {
    socketEmit: (key: string, data: object) => void;
  }
}

SIMULATE.socketEmit = (key, data) => {
  for (const call of on.mock.calls) {
    if (call[0] === key) {
      call[1](data);
    }
  }
};

export type {};
