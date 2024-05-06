class MockChatMessage {
  static getSpeaker(): ReturnType<typeof ChatMessage.getSpeaker> {
    throw new Error('Not mocked');
  }

  static create(): ReturnType<typeof ChatMessage.create> {
    throw new Error('Not mocked');
  }

  get alias() {
    return 'MockChatMessage-alias';
  }
}

window.ChatMessage = MockChatMessage as unknown as typeof ChatMessage;
