/* globals describe it */
const zapier = require('zapier-platform-core');
const nock = require('nock');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Balance', () => {
  describe('search', () => {
    beforeEach(() => {
      nock('https://test.buda.com/api/v2')
        .get('/balances')
        .reply(200, { balances: [{
            id: 'BCH',
            account_id: 13,
            amount: [1.0, 'BCH'],
            available_amount: [0.5, 'BCH'],
            frozen_amount: [0.3, 'BCH'],
            pending_withdraw_amount: [0.2, 'BCH'],
          },
          {
            id: 'BTC',
            account_id: 13,
            amount: [1.0, 'BTC'],
            available_amount: [0.5, 'BTC'],
            frozen_amount: [0.3, 'BTC'],
            pending_withdraw_amount: [0.2, 'BTC'],
          }] });
    });

    it('fetches balances from the /balances endpoint and transforms them', async () => {
      const response = await appTester(
        App.resources.balance.search.operation.perform,
        { inputData: { currency: 'BTC' } },
      );

      expect(response).toEqual(
        [{
          currency: 'BTC',
          amount: 1.0,
          availableAmount: 0.5,
          frozenAmount: 0.3,
          pendingWithdrawAmount: 0.2,
        }]
      );
    });
  });
});
