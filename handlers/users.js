import { DateTime } from 'luxon'
import uuid from 'short-uuid'
import _ from 'lodash'

export default function (app) {
  /**
     * Retrieves a User User
     * @param {number} id - The user ID
     * @return {object} - The user details including balance
     */
  app.get('/users', async (req, res) => {
    console.log("<<< GET ALL USERS >>>")
    const {
      users,
    } = req.db.data

    return res.send(users)
  })

  app.get('/users/:id', async (req, res) => {
    console.log("<<< GET USER >>>")
    const {
      users,
    } = req.db.data

    const userId = req.params.id
    const user = users.find((r) => r.id === userId)

    if (!user) return res.status(404).json({ message: 'Error: User does not exist' })

    return res.send(user)
  })

  /**
     * Todo: Gets all accounts for a user
     * @param {number} userId - The User ID to query
     * @return {array} - Array of Accounts for a user
     */
  app.get('/users/:userId/accounts', async (req, res) => {
    console.log("<<< GET USER ACCOUNTS >>>")
    const {
      users,
    } = req.db.data

    const userId = req.params.userId
    const user = users.find((r) => r.id === userId)

    if (!user) return res.status(404).json({ message: 'Error: User does not exist' })

    const {
      accounts,
    } = req.db.data
    
    const account = []

    accounts.forEach((n, idx) => {
      if (accounts[idx].userId === userId) {
        account.push(accounts[idx])
      }
    })

    return res.send(account)
  })

  /**
     * Creates a new user user
     * @param {string} firstName - Firstname of the user
     * @param {string} lastName - LastName of the user
     * @return {object} - The user user created
     */
  app.post('/users', async (req, res) => {
    console.log("<<< POST USERS >>>")
    const {
      users,
    } = req.db.data

    const userRec = {
      id: uuid.generate(),
      createdAt: DateTime.utc().toISO(),
      updatedAt: DateTime.utc().toISO(),
      ...req.body
    }

    const user = users.push(userRec)

    app.log.info({
      id: user.id,
    }, 'User created')

    req.db.write()

    res.status(201).json(userRec)
  })

  app.put('/users', async (req, res) => {
    const userId = req.body.id

    const {
      users,
    } = req.db.data

    const checkUser = users.find((r) => r.id === userId);
    if (!checkUser) return res.status(404).json({ message: 'Error: User does not exist' });

    const fieldsToUpdate = {
      updatedAt: DateTime.utc().toISO(),
      ...req.body,
    };

    // Update record
    let updatedUser;
    users.map((r) => {
      if (r.id === userId) {
        updatedUser = _.assign(r, fieldsToUpdate)
      }
      return r
    });

    app.log.info({
      id: updatedUser.id,
    }, 'User updated');

    req.db.write();

    return res.status(200).json(updatedUser);
  });

  app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    const {
      users,
    } = req.db.data;

    const user = users.find((r) => r.id === userId);
    if (!user) return res.status(404).json({ message: 'Error: User does not exist' });

    _.remove(users, (r) => r.id === userId);

    app.log.info({
      id: user.id,
    }, 'User deleted');

    req.db.write();

    return res.sendStatus(200);
  });
}
