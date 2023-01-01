declare global {
  namespace ClientSettings {
    interface Values {
      [key: `${string}.debug`]: boolean
    }
  }
}

export {};
