/* eslint-disable import/extensions */
import server from 'express';
import bunyan from 'bunyan';
import config from './config.js';
import appDb from './db/lowdb.js';

// handlers
import users from './handlers/users.js';
import accounts from './handlers/accounts.js';
import transactions from './handlers/transactions.js';

const log = bunyan.createLogger(config.log);

const app = server();

app.use(server.json());

app.db = appDb;
app.log = log;

// Request logging
app.use((req, res, next) => {
  log.info(req.url);
  next();
});

// Error logging
app.use((err, req, res, next) => {
  log.error(err);
  next();
});

app.use(async (req, res, next) => {
  req.db = appDb;

  users(app);
  accounts(app);
  transactions(app);

  return next();
});

app.get('/echo', (req, res) => {
  res.send('code-a-bank');
});

export default app;
