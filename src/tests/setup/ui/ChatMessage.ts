class MockChatMessage {
  constructor() {
  }

  static getSpeaker(): ReturnType<typeof ChatMessage.getSpeaker> {
    throw new Error('Not mocked');
  }

  static create(): ReturnType<typeof ChatMessage.create> {
    throw new Error('Not mocked');
  }
}

window.ChatMessage = MockChatMessage as unknown as typeof ChatMessage;
