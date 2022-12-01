/* eslint-disable no-undef */
/* eslint-disable import/extensions */
import _ from 'lodash';
import fixtures from '../fixtures/db.js';

describe('Transactions API', () => {
  let fixture;
  let transaction;
  let sourceAccount;
  let destinationAccount;

  beforeEach(() => {
    fixture = _.cloneDeep(fixtures);
    app.db.data = fixture;

    [transaction] = fixture.transactions;
    [sourceAccount] = fixture.accounts;
    destinationAccount = fixture.accounts[2];
  });

  it('GET /transactions should return a transaction', (done) => {
    request
      .get(`/transactions/${transaction.id}`)
      .send(transaction)
      .expect(200)
      .end((err, res) => {
        expect(res.body.firstName).to.eql(transaction.firstName);
        expect(res.body.lastName).to.eql(transaction.lastName);

        done(err);
      });
  });

  describe('Deposit transaction', () => {
    // Todo: Add at least 2 unit test
    // e.g. Validate response, validate logic
    it('POST /transactions - Deposit Transaction 1', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        type: 'deposit',
        amount: 100,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.include(newTransaction);

          done(err);
        });
    });

    it('POST /transactions - Deposit Transaction 2', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        type: 'deposit',
        amount: 500,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.include(newTransaction);

          done(err);
        });
    });
  });

  describe('Withdrawal transaction', () => {
    // Todo: Add at least 2 unit test
    // e.g. Validate response, validate logic
    it('POST /transactions - Withdrawal Transaction 1', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        type: 'withdrawal',
        amount: 1,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.include(newTransaction);

          done(err);
        });
    });

    it('POST /transactions - Withdrawal Transaction 2', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        type: 'withdrawal',
        amount: 10,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.include(newTransaction);

          done(err);
        });
    });
  });

  describe('Transfer transaction', () => {
    // Todo: Add at least 2 unit test
    // e.g. Validate response, validate logic
    it('POST /transactions - Transfer Transaction 1', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        type: 'transfer',
        destAccountId: destinationAccount.id,
        amount: 1,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.include(newTransaction);

          done(err);
        });
    });

    it('POST /transactions - Transfer Transaction 2', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        type: 'transfer',
        destAccountId: destinationAccount.id,
        amount: 10,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.include(newTransaction);

          done(err);
        });
    });
  });

  describe('Error handling', () => {
    it('POST /transactions - Error: Invalid amount', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        type: 'deposit',
        amount: 'abc',
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.include({
            message: 'Error: Invalid amount',
          });

          done(err);
        });
    });

    it('POST /transactions - Error: Account not found', (done) => {
      const newTransaction = {
        accountId: 'DOES NOT EXIST',
        type: 'deposit',
        amount: 100,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(404)
        .end((err, res) => {
          expect(res.body).to.include({
            message: 'Error: Account not found',
          });

          done(err);
        });
    });

    it('POST /transactions - Error: Invalid transaction type', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        type: 'INVALID',
        amount: 'abc',
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.include({
            message: 'Error: Invalid transaction type',
          });

          done(err);
        });
    });

    it('POST /transactions - Transfer - Error: Destination account not found', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        destAccountId: 'DOES NOT EXIST',
        type: 'transfer',
        amount: 100000,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(404)
        .end((err, res) => {
          expect(res.body).to.include({
            message: 'Error: Destination account not found',
          });

          done(err);
        });
    });

    it('POST /transactions - Transfer - Error: Insufficient balance', (done) => {
      const newTransaction = {
        accountId: sourceAccount.id,
        destAccountId: destinationAccount.id,
        type: 'transfer',
        amount: 100000,
      };

      request
        .post('/transactions')
        .send(newTransaction)
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.include({
            message: 'Error: Insufficient balance',
          });

          done(err);
        });
    });
  });
});
