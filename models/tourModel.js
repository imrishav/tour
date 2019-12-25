const mongoose = require('mongoose');

const tours = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    default: 4.6
  },
  price: {
    type: Number,
    required: [true, 'A Price is Reuired']
  }
});

const Tour = mongoose.model('Tour', tours);

module.exports = Tour;
