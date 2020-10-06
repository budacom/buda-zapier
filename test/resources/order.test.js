const zapier = require('zapier-platform-core');
const nock = require('nock');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Order', () => {
  describe('create', () => {
    it('performs a POST request to /orders', async () => {
      const spy = nock('https://test.buda.com/api/v2')
        .post(
          '/markets/btc-clp/orders',
          { amount: '0.1', type: 'Bid', price_type: 'market' }
        )
        .reply(201, { order: { id: 'foo', state: 'traded' } });

      await appTester(
        App.resources.order.create.operation.perform,
        { inputData: { amount: '0.1', market: 'btc-clp', type: 'Bid' } },
      );

      expect(spy.isDone()).toBeTruthy();
    });

    it('transforms response output', async () => {
      const spy = nock('https://test.buda.com/api/v2')
        .post(
          '/markets/btc-clp/orders',
          { amount: '0.1', type: 'Bid', price_type: 'market' }
        )
        .reply(201, {
          order: {
            id: 'foo',
            state: 'traded',
            traded_amount: [0.1, 'BTC'],
            total_exchanged: [1000000.0, 'CLP'],
            paid_fee: [0.00001, 'BTC']
          }
        });

      const response = await appTester(
        App.resources.order.create.operation.perform,
        { inputData: { amount: '0.1', market: 'btc-clp', type: 'Bid' } },
      );

      expect(response).toEqual({
        id: 'foo',
        state: 'traded',
        tradedAmount: 0.1,
        totalExchanged: 1000000.0,
        fee: 0.00001
      });
    });

    describe('when order is not traded inmediately', () => {
      beforeEach(() => {
        nock('https://test.buda.com/api/v2')
          .post(
            '/markets/btc-clp/orders',
            { amount: '0.1', type: 'Bid', price_type: 'market' }
          )
          .reply(201, { order: { id: 'foo', state: 'received' } });
      });

      it('performs a GET request to /orders/:id until prepared', async () => {
        const spy = nock('https://test.buda.com/api/v2')
          .get('/orders/foo')
          .reply(200, { order: { id: 'foo', state: 'traded' } });

        await appTester(
          App.resources.order.create.operation.perform,
          { inputData: { amount: '0.1', market: 'btc-clp', type: 'Bid' } },
        );

        expect(spy.isDone()).toBeTruthy();
      });
    });
  });
});
