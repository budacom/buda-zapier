const sample = require('../samples/sample_withdrawal');

// get a list of withdrawals
const performSearch = async (z, bundle) => {
  const params = {};
  if (bundle.inputData.state) params.state = bundle.inputData.state;

  const response = await z.request({
    url: `${process.env.API_BASE_URL}/currencies/${bundle.inputData.currency}/withdrawals`,
    params: params,
  });

  return response.data.withdrawals;
};

// creates a new withdrawal
const performCreate = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${process.env.API_BASE_URL}/currencies/${bundle.inputData.currency}/withdrawals`,
    body: {
      // todo
    }
  });

  return response.data.withdrawal;
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
        { key: 'currency', required: true },
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
        { key: 'currency', required: true },
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
        { key: 'currency', required: true }
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
