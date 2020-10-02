/* globals describe it */
const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('My App', () => {
  it('should run resources.balance', async () => {
    const bundle = { inputData: {} };

    const results = await appTester(App.resources.balance.search.operation.perform, bundle);
    should.exist(results);
  });
});
