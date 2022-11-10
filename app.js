require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');
const setRoutes = require('./routes/routes');
const setMiddlewares = require('./middleware/middlewares');

app.set('view engine', 'ejs');
app.set('views', 'views');

setMiddlewares(app)

setRoutes(app)

app.use((req,res,next) => {
  let error = new Error('404 page not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  if(error.status === 404) {
    return res.render('pages/error/404.ejs', { flashMessage: {} })
  }
  console.log(chalk.red.inverse(error.message));
  console.log(error);
  return res.render('pages/error/500.ejs', { flashMessage: {} })
})

const PORT = process.env.PORT || 2000

mongoose.connect(`mongodb+srv://${config.get('db-admin')}:${config.get('db-password')}@blogpost-app.l1ecnyb.mongodb.net/blogpost-app`, {
  useNewUrlParser: true
})
        .then(()=> {
          console.log(chalk.greenBright(`Database connected!`));
          app.listen(PORT, ()=> {
            console.log(chalk.greenBright(`Server running successfully on port: ${PORT}`));
          })
        })
        .catch(error => {
          return console.log(error);
        })
