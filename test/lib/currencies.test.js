const currencies = require('../../lib/currencies');

describe('currencies', () => {
  describe('isCrypto', () => {
    it('returns true for crypto currencies', () => {
      expect(currencies.isCrypto('BTC')).toBeTruthy();
    });

    it('returns false for fiat currencies', () => {
      expect(currencies.isCrypto('CLP')).toBeFalsy();
    });
  });

  describe('allChoices', () => {
    it('returns a hash where key is currency code and value is human currency name', () => {
      expect(currencies.allChoices()['BTC']).toEqual('Bitcoin');
    });
  });

  describe('choicesForWithdrawal', () => {
    it('returns a hash where key is currency code and value is human currency name', () => {
      expect(currencies.allChoices()['BTC']).toEqual('Bitcoin');
    });
  });
});