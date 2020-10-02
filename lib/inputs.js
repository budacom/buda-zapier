const isCrypto = (currency) => {
    return currency === 'BTC' || currency === 'ETH' || currency === 'LTC';
};

module.exports = {
  currency: {
    choices: ['BTC', 'ETH', 'LTC', 'CLP'],
    isCrypto: isCrypto
  }
}