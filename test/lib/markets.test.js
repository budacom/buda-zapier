const markets = require('../../lib/markets');

describe('markets', () => {
  describe('allChoices', () => {
    it('returns a hash where key is market code and value is human market name', () => {
      expect(markets.allChoices()['btc-clp']).toEqual('BTC/CLP');
    });
  });

  describe('choicesForOrders', () => {
    it('returns a hash where key is market code and value is human market name', () => {
      expect(markets.choicesForOrders()['btc-clp']).toEqual('BTC/CLP');
    });
  });
});