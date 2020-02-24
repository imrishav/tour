const { promisify } = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

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
    // next(new AppError('Please Provide email and Password', 400));
    return 'incorrect Email Password';
  }

  const token = signToken(user._id);
  // const token = '';

  console.log('toke', token);

  res.status(200).json({
    status: 'Success',
    token
  });
};

exports.protect = async (req, res, next) => {
  //Catch Aync Function here
  //get the token first
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // return next(new AppError('not logged in', 401));
    return next(console.log('not logged in')); //App Error Function Here
  }

  //validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // TODO; // Added Error Handling (Protecting Routes)

  //Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(console.log('User No longer Exist')); //App Function Here
    // return new AppError('The user belonging to this token does\nt exits',401);
  }

  //check if user change password after jwt issued

  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('recentyl chned pas!login again', 401));
  }

  req.user = freshUser;

  next();
};
