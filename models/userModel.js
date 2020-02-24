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
    minlength: 8,
    select: false
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
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  canidatePassword,
  userPassword
) {
  return await bcrypt.compare(canidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = async function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
