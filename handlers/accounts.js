import { DateTime } from 'luxon'
import uuid from 'short-uuid'
import _ from 'lodash'

export default function (app) {
  /**
     * Todo: Retrieves an account
     * @param {number} id - The account ID
     * @return {object} - The account details including balance
     */
  app.get('/accounts', async (req, res) => {
    // Todo
    console.log('<<< GET ALL ACCOUNTS <<<')
    const {
      accounts,
    } = req.db.data

    return res.send(accounts)
  })

  app.get('/accounts/:id', async (req, res) => {
    console.log('<<< GET ACCOUNTS <<<')

    const {
      accounts,
    } = req.db.data

    const accountId = req.params.id
    const account = accounts.find((r) => r.id === accountId)

    if (!account) return res.status(404).json({ message: 'Error: Account does not exist' })

    return res.send(account)
  })

  /**
     * Todo: Creates a new account
     * @param {string} userId - The userId of the account that belongs to
     * @param {string} type - Type of account. `savings` or `checking`
     * @return {object} - The account record created
     */
  app.post('/accounts', async (req, res) => {
    // New account created should have balance:0
    console.log("<<< POST ACCOUNTS >>>")
    const {
      users,
    } = req.db.data

    const accountRec = {
      id: uuid.generate(),
      createdAt: DateTime.utc().toISO(),
      updatedAt: DateTime.utc().toISO(),
      ...req.body,
      balance: 0
    }

    let userisValid = false
    users.forEach((n, idx) => {
      if (req.body.userId === users[idx].id) {
        userisValid = true
      }
    })

    const {
      accounts,
    } = req.db.data

    if ((!req.body.type) || (req.body.type !== "savings") && (req.body.type !== "checking")) {
      return res.status(404).json({ message: 'Error: Invalid account type' })
    }

    if (!userisValid) {
      return res.status(404).json({ message: 'Error: Invalid user for account' })
    }

    const account = accounts.push(accountRec)

    app.log.info({
      id: account.id,
    }, 'Account created')

    req.db.write()

    res.status(201).json(accountRec)
  })
}
