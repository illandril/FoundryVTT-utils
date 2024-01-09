class MockApplication {
  options: ApplicationOptions;
  constructor(options?: object) {
    this.options = {
      ...(this.constructor as typeof Application).defaultOptions,
      ...options,
    };
  }

  static get defaultOptions() {
    return {
      baseApplication: null,
      width: null,
      height: null,
      top: null,
      left: null,
      scale: null,
      popOut: true,
      minimizable: true,
      resizable: false,
      id: '',
      classes: [],
      dragDrop: [],
      tabs: [],
      filters: [],
      title: '',
      template: null,
      scrollY: [],
    };
  }

  get element(): Application['element'] {
    throw new Error('not mocked');
  }

  get rendered() {
    return false;
  }

  get position(): Application['position'] {
    throw new Error('not mocked');
  }

  get title() {
    return game.i18n.localize(this.options.title);
  }

  setPosition(): ReturnType<Application['setPosition']> {
    throw new Error('not mocked');
  }

  render(): ReturnType<Application['render']> {
    throw new Error('not mocked');
  }

  close(): ReturnType<Application['close']> {
    throw new Error('not mocked');
  }
}

window.Application = MockApplication as typeof Application;
