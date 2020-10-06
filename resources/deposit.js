const currencies = require('../lib/currencies');
const sample = require('../samples/sample_deposit');

// get a list of deposits
const performList = async (z, bundle) => {
  const params = {};
  if (bundle.inputData.state) params.state = bundle.inputData.state;
  if (bundle.inputData.currency) params.currency = bundle.inputData.currency;

  const response = await z.request({
    url: `${process.env.API_BASE_URL}/deposits`,
    params: params,
  });

  return response.data.deposits;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#resourceschema
  key: 'deposit',
  noun: 'Deposit',

  // If `get` is defined, it will be called after a `search` or `create`
  // useful if your `searches` and `creates` return sparse objects
  // get: {
  //   display: {
  //     label: 'Get Deposit',
  //     description: 'Gets a deposit.'
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
      label: 'New Deposit',
      description: 'Triggers when a new deposit is created.'
    },
    operation: {
      perform: performList,
      // `inputFields` defines the fields a user could provide
      // Zapier will pass them in as `bundle.inputData` later. They're optional on triggers, but required on searches and creates.
      inputFields: [
        { key: 'currency', required: false, choices: currencies.allChoices() },
        { key: 'state', required: false },
      ],
    }
  },

  // search: {
  //   display: {
  //     label: 'Find Deposit',
  //     description: 'Finds a deposit give.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'name', required: true}
  //     ],
  //     perform: performSearch
  //   },
  // },

  // create: {
  //   display: {
  //     label: 'Create Deposit',
  //     description: 'Creates a new deposit.'
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
