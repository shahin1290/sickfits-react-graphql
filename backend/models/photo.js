const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Photo',
  mongoose.Schema({
    imageUrl: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  })
);
