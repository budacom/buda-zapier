/* globals describe it */
const zapier = require('zapier-platform-core');
const nock = require('nock');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('LightingNetworkInvoice', () => {
  describe('create', () => {
    it('performs a POST request to /lightning_network_invoices', async () => {
      const spy = nock('https://test.buda.com/api/v2')
        .post(
          '/lightning_network_invoices',
          { amount_satoshis: '1000', memo: 'tesing invoice', expiry_seconds: 3600, currency: 'BTC' }
        )
        .reply(201, {
          invoice: { id: 'foo', currency: 'BTC', encoded_payment_request: 'encoded_request' }
        });

      await appTester(
        App.resources.lightning_invoice.create.operation.perform,
        { inputData: { amount_satoshis: '1000', memo: 'tesing invoice', expiry_seconds: 3600 } },
      );

      expect(spy.isDone()).toBeTruthy();
    });
  });
});
