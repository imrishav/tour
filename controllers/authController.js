const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = id => {
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser
    }
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //Check for email and passwor
  if (!email || !password) {
    // TODO // Add error Class
    console.log('please Provide Email & password');
    return res.status(400).send({
      message: 'this is error'
    });
  }

  //Check if user exist and match it then

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return 'incorrect Email Password';
  }
  console.log(user);

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
};
