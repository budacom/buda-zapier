const {
  config: authentication,
  befores = [],
  afters = [],
} = require('./authentication');

const withdrawalResource = require("./resources/withdrawal");

const depositResource = require("./resources/deposit");

const balanceResource = require("./resources/balance");

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...befores],

  afterResponse: [...afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {},

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {},

  resources: {
    [withdrawalResource.key]: withdrawalResource,
    [depositResource.key]: depositResource,
    [balanceResource.key]: balanceResource
  },
};
