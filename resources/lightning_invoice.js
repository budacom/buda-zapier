const sample = require('../samples/sample_lightning_network_invoice');

const transform = (invoice) => {
  return {
    id: invoice.id,
    currency: invoice.currency,
    encodedPaymentRequest: invoice.encoded_payment_request,
  }
}

// creates a new lightning_invoice
const performCreate = async (z, bundle) => {
  let payload = {
    amount_satoshis: bundle.inputData.amount_satoshis,
    currency: 'BTC',
    memo: bundle.inputData.memo,
    expiry_seconds: bundle.inputData.expiry_seconds,
  };

  const response = await z.request({
    method: 'POST',
    url: `${process.env.API_BASE_URL}/lightning_network_invoices`,
    body: payload,
  });

  return response.data.invoice;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#resourceschema
  key: 'lightning_invoice',
  noun: 'LightningInvoice',

  // If `get` is defined, it will be called after a `search` or `create`
  // useful if your `searches` and `creates` return sparse objects
  // get: {
  //   display: {
  //     label: 'Get Lightning_invoice',
  //     description: 'Gets a lightning_invoice.'
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
  //     label: 'New Lightning Invoice',
  //     description: 'Lists the lightning invoices.'
  //   },
  //   operation: {
  //     perform: performList,
  //     // `inputFields` defines the fields a user could provide
  //     // Zapier will pass them in as `bundle.inputData` later. They're optional on triggers, but required on searches and creates.
  //     inputFields: []
  //   }
  // },

  // search: {
  //   display: {
  //     label: 'Find Lightning_invoice',
  //     description: 'Finds a lightning_invoice give.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'name', required: true}
  //     ],
  //     perform: performSearch
  //   },
  // },

  create: {
    display: {
      label: 'Create Lightning Invoice',
      description: 'Creates a new lightning invoice.'
    },
    operation: {
      inputFields: [
        {
          key: 'amount_satoshis',
          type: 'integer',
          required: true },
        { key: 'memo', required: false },
        {
          key: 'expiry_seconds',
          required: true,
          type: 'integer',
          default: '3600',
          helpText: 'La cantidad de tiempo en segundos en la que el invoice expirará',
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
    { key: 'encoded_payment_request', label: 'encoded_payment_request'},
  ]
};
