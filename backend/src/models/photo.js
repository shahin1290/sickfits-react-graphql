const mongoose = require('mongoose');

const Photo =  mongoose.model(
  'Photo',
  mongoose.Schema({
    imageUrl: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  })
);

module.exports = {Photo}