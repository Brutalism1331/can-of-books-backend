'use strict';

// imports and required installs.
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const BookModel = require('./models/books.js');
require('dotenv').config();
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;

// JWT token for Auth.
// All of this came from jsonwebtoken docs and will be EXACTLY THE SAME
const { response } = require('express');
var client = jwksClient({
  // Make sure you have your unique dev-key.
  jwksUri: 'https://dev-9elj7pr7.us.auth0.com/.well-known/jwks.json'
});
//Part of JWT token for Auth.
function getKey(header, callback) {
  console.log(header);
  client.getSigningKey(header.kid, function (err, key) {

    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

// Routs.
app.get('/', (req, res) => {
  res.send('Hello Human');
});
// Use to clear dBase.
app.get('/clear', clear);

// Use this to seed the dBase.
app.get('/seed', seed);

// Books from dBase rout.
app.get('/books', (req, res) => {
  console.log(req.headers);
  try {
    const token = req.headers.authorization.split(' ')[1];

    // JWT token Auth
    jwt.verify(token, getKey, {}, function (err, user) {
      if (err) { // If we have a JWT verification error.
        res.status(500).send('inValid token');
      } else {
        BookModel.find((err, dataBaseResults) => {
          if (err) { // If we can't access our dBase.
            res.send('can\'t access DB');
          } else {
            res.status(200).send(dataBaseResults);
            console.log(dataBaseResults)
          };
        });
      }
    });
  } catch (err) {
    res.status(500).send(err);
  };
});

app.listen(3001, () => {
  console.log('Server up on 3001');
});

// Connect to dBase
mongoose.connect('mongodb://localhost:27017/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then( () => {
  console.log('connected to database');
});

// Functions.
// How do i send a response instead of a console.log so that the page isn't stuck loading?
async function clear(req, res) {
  try {
    await BookModel.deleteMany({});
    res.status(200).send('Cleared')
    console.log('Bombed the DBase');
  } catch (err) {
    console.log('Error in clearing database');
  };
};

async function addBook(obj) {

  let newBook = new BookModel(obj);
  return await newBook.save();
};

async function seed(req, res) {
  console.log('seeding the db');
  let books = await BookModel.find({});
  if (books.length === 0) {
    await addBook({
      title: "Brutalism, Volume 1",
      description: "A story of life, Overcoming challenges and The lessons learned",
      status: "Still being written",
      email: "Brutalism.1331@gmail.com",
    });
    await addBook({
      title: "Brutalism, Volume 2",
      description: "A story of life, Overcoming challenges and The lessons learned",
      status: "Still being written",
      email: "Brutalism.1331@gmail.com",
    });
    await addBook({
      title: "Brutalism, Volume 3",
      description: "A story of life, Overcoming challenges and The lessons learned",
      status: "Still being written",
      email: "Brutalism.1331@gmail.com",
    });
  };
};
