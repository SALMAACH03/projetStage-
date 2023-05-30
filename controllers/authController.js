const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('./../helpers/authHelpers');
const jwt = require('jsonwebtoken');

// Register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name) {
      return res.send({ error: 'Name is required' });
    }
    if (!email) {
      return res.send({ error: 'Email is required' });
    }
    if (!password) {
      return res.send({ error: 'Password is required' });
    }
    if (!phone) {
      return res.send({ error: 'Phone is required' });
    }
    if (!address) {
      return res.send({ error: 'Address is required' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({ success: true, message: 'Already registered, please login' });
    }

    const hashedPassword = await hashPassword(password);
    const user = new userModel({ name, email, phone, address, password: hashedPassword });
    await user.save();

    res.status(201).send({ success: true, message: 'User registered successfully', user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Error in login',
        error,
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).send({
      success: true,
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
};
