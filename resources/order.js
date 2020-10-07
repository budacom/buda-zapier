const markets = require('../lib/markets');
const sample = require('../samples/sample_order');

const transform = (order) => {
  return {
    id: order.id,
    market: order.market_id,
    type: order.type,
    state: order.state,
    tradedAmount: order.traded_amount && order.traded_amount[0],
    totalExchanged: order.total_exchanged && order.total_exchanged[0],
    fee: order.paid_fee && order.paid_fee[0],
  };
}

const performCreate = async (z, bundle) => {
  let response = await z.request({
    method: 'POST',
    url: `${process.env.API_BASE_URL}/markets/${bundle.inputData.market}/orders`,
    body: {
      amount: bundle.inputData.amount,
      type: bundle.inputData.type,
      price_type: 'market',
    },
  });

  while (response.data.order.state == 'received' || response.data.order.state == 'pending') {
    response = await z.request({
      method: 'GET',
      url: `${process.env.API_BASE_URL}/orders/${response.data.order.id}`,
    });
  }

  return transform(response.data.order);
};

module.exports = {
  key: 'order',
  noun: 'Order',

  create: {
    display: {
      label: 'Create Order',
      description: 'Creates a new market order.',
    },
    operation: {
      inputFields: [
        {
          key: 'market',
          required: true,
          choices: markets.choicesForOrders(),
          helpText: 'Specify the market where to create the order.'
        },
        {
          key: 'type',
          required: true,
          choices: { 'Bid': 'Buy', 'Ask': 'Sell' },
          helpText: 'Specify the type of order. Are you buying or selling.'
        },
        {
          key: 'amount',
          required: true,
          type: 'number',
          helpText: 'Specify the amount to create the order.',
        },
      ],
      perform: performCreate,
    },
  },

  sample: sample,

  outputFields: [
    { key: 'id', label: 'ID', type: 'integer' },
    { key: 'market', label: 'Market' },
  ]
};
