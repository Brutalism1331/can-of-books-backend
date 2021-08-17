'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;


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

app.listen(PORT, () => console.log(`listening on ${PORT}`));
