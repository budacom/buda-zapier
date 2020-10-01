/* globals describe, it, expect */

const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');
const MockDate = require('mockdate');

describe('custom auth', () => {
  it('passes authentication and returns json', async () => {
    const bundle = {
      authData: {
        apiKey: 'foo',
        apiSecret: 'good',
      },
    };

    MockDate.set(1434319925275);

    nock('https://test.buda.com/api/v2', {
      reqheaders: {
        'X-SBTC-APIKEY': 'foo',
        'X-SBTC-NONCE': 1434319925275,
        // use a signature generated by a proven lib:
        'X-SBTC-SIGNATURE': '05424580abe948f6c675c6ca216c714b25fa073f7f37065ed1675a656ee6e917c25bc2\
d9269cb7eaf8270d68c06dc406',
      },
    }).get('/me').reply(200, { foo: 'bar' });

    const response = await appTester(App.authentication.test, bundle);
    MockDate.reset();

    expect(response.data).toHaveProperty('foo');
  });

  it('fails on bad auth', async () => {
    const bundle = {
      authData: {
        apiKey: 'foo',
        apiSecret: 'bad',
      },
    };

    nock('https://test.buda.com/api/v2').get('/me').reply(401);

    try {
      await appTester(App.authentication.test, bundle);
    } catch (error) {
      expect(error.message).toContain('The API Key you supplied is incorrect');
      return;
    }
    throw new Error('appTester should have thrown');
  });
});
