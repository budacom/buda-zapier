/* globals describe it */
const zapier = require('zapier-platform-core');
const nock = require('nock');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Deposit', () => {
  describe('list', () => {
    beforeEach(() => {
      nock('https://test.buda.com/api/v2')
        .get('/deposits')
        .reply(200, { deposits: [{ id: 'foo', amount: [1.0, 'BTC'], fee: [0.001, 'BTC'] }] });
    });

    it('fetches deposits from the /deposits endpoint and transforms them', async () => {
      const response = await appTester(
        App.resources.deposit.list.operation.perform,
        { inputData: {} },
      );

      expect(response).toEqual(
        [{ id: 'foo', amount: 1.0, fee: 0.001 }]
      );
    });

    it('passes state and currency params if given', async () => {
      const spy = nock('https://test.buda.com/api/v2')
        .get('/deposits?state=foo&currency=BTC')
        .reply(200, { deposits: [] });

      const response = await appTester(
        App.resources.deposit.list.operation.perform,
        { inputData: { state: 'foo', currency: 'BTC' } },
      );

      expect(spy.isDone()).toBeTruthy();
    });
  });
});
