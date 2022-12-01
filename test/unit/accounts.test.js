/* eslint-disable no-undef */
/* eslint-disable import/extensions */
import _ from 'lodash';
import fixtures from '../fixtures/db.js';

describe('Accounts API', () => {
  // Todo: Create unit tests for Accounts API
  let fixture;
  let account;

  beforeEach(() => {
    fixture = _.cloneDeep(fixtures);
    app.db.data = fixture;

    [account] = fixture.accounts;
  });
  
  it('GET /accounts should get an account', (done) => {
    request
      .get(`/accounts/${account.id}`)
      .send(account)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.include(account);

        done(err);
      });
  });

  it('POST /accounts should create an account', (done) => {
    const newAccount = {
      userId: account.userId,
      type: account.type,
      balance: 0
    };

    request
      .post('/accounts')
      .send(newAccount)
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.include(newAccount);

        done(err);
      });
  });
});
