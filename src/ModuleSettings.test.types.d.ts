declare global {
  namespace ClientSettings {
    interface Values {
      'illandril-chat-enhancements.example': boolean
      'illandril-token-tooltips.example': boolean
      'example-module.example': boolean

      'example-module.example-boolean': boolean
      'example-module.example-string': string
      'example-module.example-number': number
      'example-module.example-object': object
    }
  }
}

export {};
