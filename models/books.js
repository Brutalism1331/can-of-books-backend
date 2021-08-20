'use strict'

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String },
  email: { type: String },
})

const BookModel = mongoose.model('books', BookSchema);

module.exports = BookModel;
