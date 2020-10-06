const currencies = require('../lib/currencies');
const sample = require('../samples/sample_balance');

const transform = (balance) => {
  return {
    currency: balance.id,
    amount: balance.amount[0],
    availableAmount: balance.available_amount[0],
    frozenAmount: balance.frozen_amount[0],
    pendingWithdrawAmount: balance.pending_withdraw_amount[0]
  }
}

// find a particular balance by name (or other search criteria)
const performSearch = async (z, bundle) => {
  const params = {};
  const response = await z.request({
    url: `${process.env.API_BASE_URL}/balances/${bundle.inputData.currency}`,
    params: params
  });

  return [transform(response.data.balance)];
};

module.exports = {
  key: 'balance',
  noun: 'Balance',

  search: {
    display: {
      label: 'Get Balance',
      description: 'Get the balance for a given currency.'
    },
    operation: {
      inputFields: [
        {
          key: 'currency',
          required: true,
          label: 'Currency',
          helpText: 'Specify the currency to find the balance for.',
          choices: currencies.allChoices()
        },
      ],
      perform: performSearch
    },
  },

  sample: sample,

  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'currency', label: 'Currency' },
  ]
};
