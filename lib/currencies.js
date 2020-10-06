const allCurrencies = [
  { code: 'BTC', name: 'Bitcoin', crypto: true, canWithdraw: true },
  { code: 'ETH', name: 'Ethereum', crypto: true, canWithdraw: true },
  { code: 'LTC', name: 'Litecoin', crypto: true, canWithdraw: true },
  { code: 'BCH', name: 'Bitcoin Cash', crypto: true, canWithdraw: true },
  { code: 'CLP', name: 'Chilean Peso', crypto: false, canWithdraw: true },
  { code: 'COP', name: 'Colombian Peso', crypto: false, canWithdraw: false },
  { code: 'PEN', name: 'Peruvian Sol', crypto: false, canWithdraw: false },
];

module.exports = {
  isCrypto (_code) {
    const currency = allCurrencies.find(c => c.code === _code);
    return currency && currency.crypto;
  },
  allChoices () {
    return allCurrencies.reduce((m, c) => (m[c.code] = c.name) && m, {});
  },
  choicesForWithdrawal () {
    return allCurrencies.reduce((m, c) => c.canWithdraw ? (m[c.code] = c.name) && m : m, {});
  },
};
