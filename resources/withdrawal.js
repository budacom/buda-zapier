const currencies = require('../lib/currencies')
const sample = require('../samples/sample_withdrawal');

const transform = (withdrawal) => {
  return {
    id: withdrawal.id,
    state: withdrawal.state,
    amount: withdrawal.amount && withdrawal.amount[0],
    fee: withdrawal.fee && withdrawal.fee[0],
    currency: withdrawal.currency,
    withdrawalData: withdrawal.withdrawal_data,
  }
}

const withdrawalStateChoices = [
  { label: 'Withdrawal pending', value: 'pending_op_execution', sample: 'pending_op_execution'  },
  { label: 'Withdrawal confirmed', value: 'confirmed', sample: 'confirmed'  },
  { label: 'Withdrawal rejected', value: 'rejected', sample: 'rejected'  },
  { label: 'Withdrawal rejected', value: 'executing', sample: 'executing'  },
]

// get a list of withdrawals
const performSearch = async (z, bundle) => {
  const params = {};
  if (bundle.inputData.state) params.state = bundle.inputData.state;
  if (bundle.inputData.currency) params.currency = bundle.inputData.currency;

  const response = await z.request({
    url: `${process.env.API_BASE_URL}/withdrawals`,
    params: params,
  });

  return response.data.withdrawals.map((w) => transform(w));
};

// creates a new withdrawal
const performCreate = async (z, bundle) => {
  let payload = {
    amount: bundle.inputData.amount,
    withdrawal_data: {},
  };

  if (currencies.isCrypto(bundle.inputData.currency)) {
    payload.withdrawal_data.target_address = bundle.inputData.address;
  }

  let response = await z.request({
    method: 'POST',
    url: `${process.env.API_BASE_URL}/currencies/${bundle.inputData.currency}/withdrawals`,
    body: payload,
  });

  while (response.data.withdrawal.state == 'pending_preparation') {
    response = await z.request({
      method: 'GET',
      url: `${process.env.API_BASE_URL}/withdrawals/${response.data.withdrawal.id}`,
    });
  }

  return transform(response.data.withdrawal);
};

module.exports = {
  key: 'withdrawal',
  noun: 'Withdrawal',

  list: {
    display: {
      label: 'New Withdrawal',
      description: 'Triggers when a new withdrawal is created.'
    },
    operation: {
      inputFields: [
        {
          key: 'currency',
          required: false,
          choices: currencies.allChoices(),
          helpText: 'Specify the currency to watch new withdrawals.'
        },
        {
          key: 'state',
          required: false,
          helpText: 'Specify the state of the withdrawal to watch.',
          choices: withdrawalStateChoices
        },
      ],
      perform: performSearch,
    }
  },

  create: {
    display: {
      label: 'Create Withdrawal',
      description: 'Creates a new withdrawal.'
    },
    operation: {
      inputFields: [
        {
          key: 'currency',
          required: true,
          choices: currencies.choicesForWithdrawal(),
          altersDynamicFields: true,
          helpText: 'Specify the currency to create the withdrawals.'
        },
        {
          key: 'amount',
          required: true,
          helpText: 'Specify the amount to execute the withdrawal.',
          type: 'number'
        },
        function (z, bundle) {
          if(currencies.isCrypto(bundle.inputData.currency)) {
            return [{
              key: 'address',
              required: true,
              helpText: 'The wallet address to send the coins to.'
            }];
          }

          return [];
        },
      ],
      perform: performCreate
    },
  },

  sample: sample,

  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'currency', label: 'Currency' },
  ]
};
