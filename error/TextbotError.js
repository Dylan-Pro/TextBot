class TextbotError extends Error { }

Object.defineProperty(TextbotError.prototype, 'name', {
  value: 'TextbotError'
});

module.exports = TextbotError;