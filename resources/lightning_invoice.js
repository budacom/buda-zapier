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
  key: 'lightning_invoice',
  noun: 'LightningInvoice',

  create: {
    display: {
      label: 'Create Lightning Network Invoice',
      description: 'Creates a new lightning network invoice.'
    },
    operation: {
      inputFields: [
        {
          key: 'amount_satoshis',
          helpText: 'Specify the amount of satoshis used to create the invoice.',
          type: 'integer',
          required: true
        },
        {
          key: 'memo',
          helpText: 'A message to bundle with the invoice.',
          required: false
        },
        {
          key: 'expiry_seconds',
          required: true,
          type: 'integer',
          default: '3600',
          helpText: 'Specify the time in which the invoice will expire in seconds. Set 0 for no expiration.',
        },
      ],
      perform: performCreate
    },
  },

  sample: sample,

  outputFields: [
    { key: 'encoded_payment_request', label: 'encoded_payment_request' },
  ]
};
