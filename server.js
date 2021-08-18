'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
app.use(cors());

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String },
  email: { type: String },
})

const BookModel = mongoose.model('books', bookSchema);



const { response } = require('express');
var client = jwksClient({

  jwksUri: 'https://dev-9elj7pr7.us.auth0.com/.well-known/jwks.json'
});

function getKey(header, callback) {
  console.log(header);
  client.getSigningKey(header.kid, function (err, key) {

    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

app.get('/', (req, res) => {
  res.send('Hello Human');
});

app.get('/test', (req, res) => {

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, getKey, {}, function (err, user) {
    if (err) {
      res.status(500).send('inValid token');
    }
    res.send(user);
  });
});

app.get('/books', async (req, res) => {

  try {
    let booksDb = await BookModel.find({});
    res.status(200).send(booksDb);
  } catch (err) {
    console.log(err);
    res.status(500).send('data base error');
  }
});

mongoose.connect('mongodb://localhost:27018/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('connected to database');

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
  });

app.listen(PORT, () => console.log(`listening on ${PORT}`));

async function addBook(obj) {

  let newBook = new BookModel(obj);
  return await newBook.save();
};

async function clear() {
  try {
    await BookModel.deleteMany({});
    console.log('Bombed the DBase');

  }
  catch (err) {
    console.log('Error in clearing database');

  };
};

clear()
