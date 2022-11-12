const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const config = require('config');
const { bindUserWithRequest } = require('./authMiddleware');
const setLocals = require('./setLocals');

const store = new MongoDBStore({
  uri: `mongodb+srv://${config.get('db-admin')}:${config.get('db-password')}@blogpost-app.l1ecnyb.mongodb.net/blogpost-app`,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 2
});

const middlewares = [
  morgan('dev'),
  express.static('public'),
  express.urlencoded({extended: true}),
  express.json(),
  session({
    // secret: config.get('secret') || 'keyboard cat',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
  flash()
]

module.exports = app => {
  middlewares.forEach(middleware => {
    app.use(middleware)
  })
}
