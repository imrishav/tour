const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Enter Email '],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid Email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please Provide a Password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm Your Password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords notsame'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
