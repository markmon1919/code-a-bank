import _ from 'lodash'
import { DateTime } from 'luxon'
import uuid from 'short-uuid'

export default function (app) {
  /**
     * Todo: Retrieves a Transaction record
     * @param {number} id - The transaction ID
     * @return {object} - The transaction details including balance
     */
   app.get('/transactions', async (req, res) => {
      // Todo
      console.log('<<< GET ALL TRANSACTIONS >>>')
      const {
        transactions,
      } = req.db.data

      return res.send(transactions)
   })

   app.get('/transactions/:id', async (req, res) => {
      // Todo
      console.log('<<< GET TRANSACTIONS >>>')
      const {
        transactions
      } = req.db.data

      const accountId = req.params.id
      const transaction = transactions.find((r) => r.id === accountId)

      if (!transaction) return res.status(404).json({ message: 'Error: Transaction does not exist' })
  
      return res.send(transaction)
  })

  /**
     * Todo: Transaction processing
     * @param {string} accountId  - The target transaction account
     * @param {number} amount - The transaction amount. Should be positive value.
     * @param {string} destAccountId  - For transfer type transaction. The destination account to tranfer the amount.
     * @param {string} type  - The transaction types. `deposit | withdrawal | transfer`
     * @return {object} - The transaction transaction created
     */
   app.post('/transactions', async (req, res) => {
      console.log('<<< POST TRANSACTIONS >>>')

      const transactionRec = {
         id: uuid.generate(),
         createdAt: DateTime.utc().toISO(),
         updatedAt: DateTime.utc().toISO(),
         ...req.body
      }

      let getAccountId
      let getUserId
      let getAccountType
      let getAmount
      let getBalance
      let getIdx

      let getDestAccount
      let destUserId
      let destAccountType
      let destAmount
      let destBalance
      let destIdx
      let destErr = false

      const {
         accounts,
      } = req.db.data

      accounts.forEach((n, idx) => {
         if (accounts[idx].id === transactionRec.accountId) {
            getAccountId = accounts[idx].id
            getUserId = accounts[idx].userId
            getAccountType = accounts[idx].type
            getAmount = transactionRec.amount
            getBalance = accounts[idx].balance
            getIdx = idx
            if (transactionRec.destAccountId) {
               getDestAccount = transactionRec.destAccountId
            }
         }

         if (accounts[idx].id === getDestAccount) {
            destUserId = accounts[idx].userId
            destAccountType = accounts[idx].type
            destAmount = transactionRec.amount
            destBalance = accounts[idx].balance + transactionRec.amount
            destIdx = idx
            destErr = true
          }
      })

      let finalBalance
      
      if (req.body.type !== "deposit" && req.body.type !== "withdrawal" && req.body.type !== "transfer") {
         return res.status(400).json({ message: 'Error: Invalid transaction type' })
      }

      if (!getAccountId) {
         return res.status(404).json({ message: 'Error: Account not found' })
      }

      if (getAmount !== parseInt(getAmount)) {
         return res.status(400).json({ message: 'Error: Invalid amount' })
      }

      if (req.body.type === "deposit") {
         finalBalance = getAmount+getBalance
      }

      if (req.body.type === "withdrawal") {
         finalBalance = getBalance-getAmount

         // if (getBalance < getAmount) {
         //    return res.status(400).json({ message: 'Error: Insufficient balance' })
         // }

         if (finalBalance < 0) {
            return res.status(404).json({ message: 'Error: Balance cannot be below 0' })
         }
      }

      if (req.body.type === "transfer") {
         finalBalance = getBalance-getAmount

         if (!destErr) {
            return res.status(404).json({ message: 'Error: Destination account not found' })
         }

         if (finalBalance < 0) {
            return res.status(400).json({ message: 'Error: Insufficient balance' })
         }

         if (transactionRec.amount < 0) {
            return res.status(404).json({ message: 'Error: Successful transfer request cannot be below 0' })
         }

         let destAccountRec = {
            id: getDestAccount,
            createdAt: DateTime.utc().toISO(),
            updatedAt: DateTime.utc().toISO(),
            userId: destUserId,
            type: destAccountType,
            balance: destBalance
         }

         accounts[destIdx] = destAccountRec
      }

      let accountRec = {
         id: getAccountId,
         createdAt: DateTime.utc().toISO(),
         updatedAt: DateTime.utc().toISO(),
         userId: getUserId,
         type: getAccountType,
         balance: finalBalance
      }

      accounts[getIdx] = accountRec

      const {
         transactions,
      } = req.db.data

      const transaction = transactions.push(transactionRec)

      app.log.info({
         id: transaction.id,
      }, 'Transaction created')

      req.db.write()
      res.status(201).json(transactionRec)
   })
}
