// logging.js
let isDebug = false; // Default to false

if (typeof process !== 'undefined' && process.env && process.env.DEBUG === 'true') {
  // If process exists and process.env is defined, set isDebug based on DEBUG env var
  isDebug = true;
}

const logger = {
  log: isDebug ? console.log.bind(console) : () => {},
  warn: isDebug ? console.warn.bind(console) : () => {},
  error: isDebug ? console.error.bind(console) : () => {},
};

export default logger;