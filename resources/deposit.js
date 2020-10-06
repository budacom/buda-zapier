const currencies = require('../lib/currencies');
const sample = require('../samples/sample_deposit');

const transform = (deposit) => {
  return {
    id: deposit.id,
    state: deposit.state,
    currency: deposit.currency,
    amount: deposit.amount && deposit.amount[0],
    fee: deposit.fee && deposit.fee[0],
    depositData: deposit.deposit_data,
  }
}

// get a list of deposits
const performList = async (z, bundle) => {
  const params = {};
  if (bundle.inputData.state) params.state = bundle.inputData.state;
  if (bundle.inputData.currency) params.currency = bundle.inputData.currency;

  const response = await z.request({
    url: `${process.env.API_BASE_URL}/deposits`,
    params: params,
  });

  return response.data.deposits.map((w) => transform(w));
};

module.exports = {
  key: 'deposit',
  noun: 'Deposit',

  list: {
    display: {
      label: 'New Deposit',
      description: 'Triggers when a new deposit is created.'
    },
    operation: {
      inputFields: [
        {
          key: 'currency',
          required: false,
          choices: currencies.allChoices(),
          helpText: 'Specify the currency to watch new deposits.'
        },
        {
          key: 'state',
          required: false,
          helpText: 'Specify the state of the deposit to watch.',
          choices: [
            { label: 'Deposit pending', value: 'pending_confirmation', sample: 'pending_confirmation',  },
            { label: 'Deposit confirmed', value: 'confirmed', sample: 'confirmed',  },
            { label: 'Deposit rejected', value: 'rejected', sample: 'rejected',  },
            { label: 'Deposit reained', value: 'retained', sample: 'retained',  },
            { label: 'Deposit anulled', value: 'anulled', sample: 'anulled',  },
          ]
        },
      ],
      perform: performList,
    }
  },

  sample: sample,

  outputFields: [
    { key: 'id', label: 'ID', type: 'integer' },
    { key: 'currency', label: 'Currency' },
  ]
};
