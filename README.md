# Code a Bank

In this project you are tasked to complete the APIs for a bank user, its account and handling bank transactions.

## Tasks

Your tasks will be to create APIs with unit tests. Fix if there are unit tests that fails.

You are given 3 hours to complete this task.

**Users API**

1. `GET /users/:id/accounts` - Return all accounts for a user
      + parameters:
          + `@id {number}` - User ID.
          + `@return {array[account]}` - List of accounts for a user.
2. Unit Test
      + Create unit test for the `GET /users/:id/accounts` API.

**Accounts API**

1. `GET /accounts/:id` - Gets an Account
      + parameters:
          + `@id {number}` - Account ID.
          + `@return {object}` - Returns the account object.
2. `POST /accounts` - Create an Account that links to a user
      + parameters:
          + `@userId {string}` - User ID that the account belongs to.
          + `@type {enum}` - Type `savings` or `checking`.
      + Account created should have a default `balance: 0` value.
3. Unit Test
      + Create unit test for the 2 Accounts API.

**Transactions API**

1. `GET /transactions/:id` - Gets a Transaction
      + parameters:
          + `@id {number}` - Transaction ID.
          + `@return {object}` - Returns the transaction object.
2. `POST /transactions` - Processes transactions.
      + parameters:
          + `@accountId {string}` - The target transaction account
          + `@type {enum}` - The transaction types. `deposit | withdrawal | transfer`
          + `@amount {number}` - The transaction amount. Should be positive value.
          + `@destinationAccountId {string}` - For transfer type transaction. The destination account to tranfer the amount.
          + `@return {object}` - Returns the transaction object
      + Types of transactions
          + `deposit` - Adds the `amount` value on the transaction account balance.
          + `withdrawal` - Subtracts the `amount` value on the transaction account balance.
              + Withdrawn amount can be a higher than the balance value but the account balance would be set to `0`.
          + `transfer` - Transfers the `amount` from the transaction source account to the destination account.
             + The source account and destination account cannot be the same.
             + The tranfer amount cannot be a higher value than the source account balance.
3. Unit Test
      + Existing unit tests should pass.
      + Create Unit Tests for each transaction type -- deposit, withdrawal, transfer.

**Stretch Goal (additional points)**

*Note: No need to upload the image on DockerHub*

1. Dockerize this application by creting a `Dockerfile`.
      + Create a `Dockerfile`.
      + Use any base image with Node 14 or above.
      + Expose the default port `3000`.
2. Mount the database to host volume.
      + Add a comment on the `Dockerfile` for creating and mounting the volume when running the application.

## Installation

Requirements
      + Node 14 or above.
      + Docker

Run `npm install`

## Scripts

**Development**

Run the dev server with nodemon

```
npm run dev
```

Run the dev server with nodemon and inspect

```
npm run dev:inspect
```

**Testing**

Run unit tests

```
npm run test:unit
```

**Production startup**
Run unit tests

```
npm start
```


## CRUD examples

Refer to the Users API handler `handlers/users.js`

## DB

This app uses LowDB which is a simple JSON based DB. See <https://github.com/typicode/lowdb>

Records on the db are stored in `req.db.data` which is just an object. Manipulate the `req.db.data` by using Javascript built-in methods or via the `lodash` package.

Initial DB is is located in `./db/db.json`;

**Schema**

```
{
    "users": [
      {
        "id": "qNir2NSPTZSq89WzpcTyqR",
        "createdAt": "2022-02-14T17:38:13.554Z",
        "updatedAt": "2022-02-14T17:38:13.554Z",
        "firstName": "John",
        "lastName": "Doe"
      }, {
        id: 'wAL6XzsBPfdUTgL9U2Uxgr',
        createdAt: '2022-02-14T17:38:13.554Z',
        updatedAt: '2022-02-14T17:38:13.554Z',
        firstName: 'Jane',
        lastName: 'Doe',
      }
    ],
    "accounts": [
      {
        "id": "cydmnpQRxmHsCWJvR9Sez4",
        "createdAt": "2022-02-14T17:38:13.554Z",
        "updatedAt": "2022-02-14T17:38:13.554Z",
        "userId": "qNir2NSPTZSq89WzpcTyqR",
        "type": "savings",
        "balance": 65
      }, {
        id: 'kPHNKLo5amyvnJiaRjr5kk',
        createdAt: '2022-02-14T17:38:13.554Z',
        updatedAt: '2022-02-14T17:38:13.554Z',
        userId: 'wAL6XzsBPfdUTgL9U2Uxgr',
        type: 'checking',
        balance: 25,
      }
    ],
    "transactions": [
      {
        "id": "4Qw5Un2Q8PpHwwGwJNRobr",
        "createdAt": "2022-02-14T17:38:13.554Z",
        "updatedAt": "2022-02-14T17:38:13.554Z",
        "accountId": "cydmnpQRxmHsCWJvR9Sez4",
        "type": "deposit",
        "amount": 65
      }, {
        id: 'wxmtdkqGkSsuFezS7yJTQi',
        createdAt: '2022-02-14T17:38:13.554Z',
        updatedAt: '2022-02-14T17:38:13.554Z',
        accountId: 'cydmnpQRxmHsCWJvR9Sez4',
        destAccountId: 'kPHNKLo5amyvnJiaRjr5kk',
        type: 'transfer',
        amount: 25,
      },
    ]
}
```