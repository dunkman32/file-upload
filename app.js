const path = require('path')
const express = require('express')

const app = express()

app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({extended: false}))
app.use(express.static('front'))
const router = require('./router')
const mongoose = require('mongoose')
const mongoUrl = require('config').get('mongo-url')
const port = require('config').get('port')
mongoose.connect(mongoUrl, {useNewUrlParser: true}).then(function () {
  console.log('Connected to DB')
}).catch(function (err) {
  console.error(err)
})

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/api', router)

// error handler
app.use(function errorHandler (err, req, res, next) {
  let code = err.errorCode || err.statusCode || 500
  let error = err.error || err
  if (code === 500)
    console.log(error.stack)
  res.status(code).send({message: error.message})
})

app.listen(port, function () {
  console.log("express has started on port 3000");
});

module.exports = app
