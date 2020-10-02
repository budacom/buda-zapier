const inputs = require('../lib/inputs');
const sample = require('../samples/sample_balance');

// find a particular balance by name (or other search criteria)
const performSearch = async (z, bundle) => {
  const currency = bundle.inputData.currency;
  const params = {};
  const response = await z.request({
    url: `${process.env.API_BASE_URL}/balances`,
    params: params
  });

  return [response.data.balances.find(balance => balance.id === currency)];
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#resourceschema
  key: 'balance',
  noun: 'Balance',

  // If `get` is defined, it will be called after a `search` or `create`
  // useful if your `searches` and `creates` return sparse objects
  // get: {
  //   display: {
  //     label: 'Get Balance',
  //     description: 'Gets a balance.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'id', required: true}
  //     ],
  //     perform: defineMe
  //   }
  // },

  // list: {
  //   display: {
  //     label: 'New Balance',
  //     description: 'Lists the balances.'
  //   },
  //   operation: {
  //     perform: performList,
  //     // `inputFields` defines the fields a user could provide
  //     // Zapier will pass them in as `bundle.inputData` later. They're optional on triggers, but required on searches and creates.
  //     inputFields: []
  //   }
  // },

  search: {
    display: {
      label: 'Find Balance',
      description: 'Finds a balance give.'
    },
    operation: {
      inputFields: [
        { key: 'currency', required: true, choices: inputs.currency.choices },
      ],
      perform: performSearch
    },
  },

  // create: {
  //   display: {
  //     label: 'Create Balance',
  //     description: 'Creates a new balance.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'name', required: true}
  //     ],
  //     perform: performCreate
  //   },
  // },

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
