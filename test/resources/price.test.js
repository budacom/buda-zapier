const zapier = require('zapier-platform-core');
const nock = require('nock');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Price', () => {
  describe('list', () => {
    beforeEach(() => {
      nock('https://test.buda.com/api/v2')
        .get('/markets/btc-clp/trades')
        .reply(200, {
          trades: {
            entries: [
              ["1601567885325", "0.00009874", "10000000.0", "buy", 432493],
              ["1601392995663", "0.02345", "1500.0", "buy", 432492],
            ],
          },
        });
    });

    it('fetches last trade from the /trade endpoint and transforms it', async () => {
      const response = await appTester(
        App.resources.price.list.operation.perform,
        { inputData: { market: 'btc-clp' } },
      );

      expect(response).toEqual(
        [{ id: 432493, price: "10000000.0", timestamp: 1601567885325, trigger: "buy" }]
      );
    });
  });
});
