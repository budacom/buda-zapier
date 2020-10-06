const allMarkets = [
  { code: 'btc-clp', name: 'BTC/CLP', liquid: true },
  { code: 'eth-clp', name: 'ETH/CLP', liquid: true },
  { code: 'ltc-clp', name: 'LTC/CLP', liquid: true },
  { code: 'bch-clp', name: 'BCH/CLP', liquid: true },
  { code: 'btc-cop', name: 'BTC/COP', liquid: true },
  { code: 'eth-cop', name: 'ETH/COP', liquid: false },
  { code: 'ltc-cop', name: 'LTC/COP', liquid: false },
  { code: 'btc-pen', name: 'BTC/PEN', liquid: true },
  { code: 'eth-pen', name: 'ETH/PEN', liquid: false },
  { code: 'ltc-pen', name: 'LTC/PEN', liquid: false },
];

module.exports = {
  choicesForOrders () {
    return allMarkets.reduce((m, c) => c.liquid ? (m[c.code] = c.name) && m : m, {});
  },
};