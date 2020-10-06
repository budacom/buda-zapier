/* globals describe it */
const zapier = require('zapier-platform-core');
const nock = require('nock');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Withdrawal', () => {
  describe('list', () => {
    beforeEach(() => {
      nock('https://test.buda.com/api/v2')
        .get('/withdrawals')
        .reply(200, { withdrawals: [{ id: 'foo', amount: [1.0, 'BTC'], fee: [0.001, 'BTC'] }] });
    });

    it('fetches withdrawals from the /withdrawals endpoint and transforms them', async () => {
      const response = await appTester(
        App.resources.withdrawal.list.operation.perform,
        { inputData: {} },
      );

      expect(response).toEqual(
        [{ id: 'foo', amount: 1.0, fee: 0.001 }]
      );
    });

    it('passes state and currency params if given', async () => {
      const spy = nock('https://test.buda.com/api/v2')
        .get('/withdrawals?state=foo&currency=BTC')
        .reply(200, { withdrawals: [] });

      const response = await appTester(
        App.resources.withdrawal.list.operation.perform,
        { inputData: { state: 'foo', currency: 'BTC' } },
      );

      expect(spy.isDone()).toBeTruthy();
    });
  });

  describe('create', () => {
    it('performs a POST request to /withdrawals', async () => {
      const spy = nock('https://test.buda.com/api/v2')
        .post(
          '/currencies/BTC/withdrawals',
          { amount: '0.1', withdrawal_data: { target_address: 'bar' } }
        )
        .reply(201, {
          withdrawal: { id: 'foo', state: 'prepared', amount: [0.1, 'BTC'], fee: [0.001, 'BTC'] }
        });

      await appTester(
        App.resources.withdrawal.create.operation.perform,
        { inputData: { amount: '0.1', currency: 'BTC', address: 'bar' } },
      );

      expect(spy.isDone()).toBeTruthy();
    });

    describe('when withdrawal is not prepared inmediately', () => {
      beforeEach(() => {
        nock('https://test.buda.com/api/v2')
          .post(
            '/currencies/BTC/withdrawals',
            { amount: '0.1', withdrawal_data: { target_address: 'bar' } }
          )
          .reply(201, { withdrawal: { id: 'foo', state: 'pending_preparation' } });
      });

      it('performs a GET request to /withdrawals/:id until prepared', async () => {
        const spy = nock('https://test.buda.com/api/v2')
          .get('/withdrawals/foo')
          .reply(200, {
            withdrawal: { id: 'foo', state: 'prepared', amount: [0.1, 'BTC'], fee: [0.002, 'BTC'] }
          });

        await appTester(
          App.resources.withdrawal.create.operation.perform,
          { inputData: { amount: '0.1', currency: 'BTC', address: 'bar' } },
        );

        expect(spy.isDone()).toBeTruthy();
      });
    });
  });
});
