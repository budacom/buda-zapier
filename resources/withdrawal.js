const inputs = require('../lib/inputs')
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

  if (inputs.currency.isCrypto(bundle.inputData.currency)) {
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
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#resourceschema
  key: 'withdrawal',
  noun: 'Withdrawal',

  // If `get` is defined, it will be called after a `search` or `create`
  // useful if your `searches` and `creates` return sparse objects
  // get: {
  //   display: {
  //     label: 'Get Withdrawal',
  //     description: 'Gets a withdrawal.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'id', required: true}
  //     ],
  //     perform: defineMe
  //   }
  // },

  list: {
    display: {
      label: 'New Withdrawal',
      description: 'Lists the withdrawals.'
    },
    operation: {
      perform: performSearch,
      inputFields: [
        { key: 'currency', required: false },
        { key: 'state', required: false },
      ]
    }
  },

  search: {
    display: {
      label: 'Find Withdrawal',
      description: 'Finds a withdrawal give.'
    },
    operation: {
      inputFields: [
        { key: 'currency', required: false },
        { key: 'state', required: false },
      ],
      perform: performSearch
    },
  },

  create: {
    display: {
      label: 'Create Withdrawal',
      description: 'Creates a new withdrawal.'
    },
    operation: {
      inputFields: [
        { key: 'currency', required: true, choices: inputs.currency.choices},
        { key: 'amount', required: true },
        { key: 'address', required: true },
        function (z, bundle) {
          if(inputs.currency.isCrypto(bundle.inputData.currency)) {
            return [{ key: 'address', required: true }];
          }

          return [];
        },
      ],
      perform: performCreate
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obvious placeholder values that we can show to any user.
  // In this resource, the sample is reused across all methods
  sample: sample,

  // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
  // For a more complete example of using dynamic fields see
  // https://github.com/zapier/zapier-platform/tree/master/packages/cli#customdynamic-fields
  // Alternatively, a static field definition can be provided, to specify labels for the fields
  // In this resource, these output fields are reused across all resources
  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'currency', label: 'Currency' },
  ]
};
