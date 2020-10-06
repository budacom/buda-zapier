const markets = require('../lib/markets');
const sample = require('../samples/sample_price');

const searchLastTrade = async (z, bundle) => {
  const response = await z.request({
    url: `${process.env.API_BASE_URL}/markets/${bundle.inputData.market}/trades`,
  });

  const lastTrade = response.data.trades.entries[0];

  if (lastTrade) {
    return [
      {
        id: lastTrade[4],
        price: lastTrade[2],
        timestamp: parseInt(lastTrade[0]),
        trigger: lastTrade[3],
      }
    ];
  } else {
    return [];
  }
};

module.exports = {
  key: 'price',
  noun: 'Price',

  list: {
    display: {
      label: 'New Price',
      description: 'Triggers when a new trade is detected.',
    },
    operation: {
      perform: searchLastTrade,
      inputFields: [
        { key: 'market', required: true, choices: markets.allChoices() },
      ],
    },
  },

  sample: sample,

  outputFields: [
    { key: 'id', label: 'Trade ID' },
    { key: 'price', label: 'Price' },
    { key: 'timestamp', label: 'Time' },
    { key: 'trigger', label: 'Triggering Order' },
  ]
};
