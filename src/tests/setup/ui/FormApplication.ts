class MockFormApplication extends Application<FormApplicationOptions> {
  object: object;

  constructor(object?: object, options?: FormApplicationOptions) {
    super(options as FormApplicationOptions);
    this.object = object ?? {};
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      classes: ['form'],
      closeOnSubmit: true,
      editable: true,
      sheetConfig: false,
      submitOnChange: false,
      submitOnClose: false,
    };
  }

  get isEditable() {
    return this.options.editable;
  }

  getData() {
    return {
      object: this.object,
      options: this.options,
      title: this.title,
    };
  }

  activateListeners() {
    // Nothing to mock
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async _updateObject() {
    throw new Error('A subclass of the FormApplication must implement the _updateObject method.');
  }
}

window.FormApplication = MockFormApplication as typeof FormApplication;
