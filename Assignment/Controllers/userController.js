const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const secretKey ='defaultSecretKeyqwertyuiopasdfghjkl';
const mongoose = require('mongoose');

const createUser = async (req, res) => {
  try {
    const { name, email, profession, address, username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      profession,
      address,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    // Compare the entered password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id },secretKey, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const trimmedUserId = userId.trim();

    // Check if the trimmed value is a valid ObjectId
    const isValidId = mongoose.Types.ObjectId.isValid(trimmedUserId);
    if (!isValidId) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    // Ensure both user IDs are in string format
    if (trimmedUserId != String(req.user._id)) {
      console.log('Comparison failed!');
      return res.status(403).json({ message: 'Forbidden. You are not allowed to access this profile.' });
    }

    // Find the user by ID
    const user = await User.findById(trimmedUserId).select('-password'); // Exclude the password from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};




const editUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const trimmedUserId = userId.trim();

    // Check if the trimmed value is a valid ObjectId
    const isValidId = mongoose.Types.ObjectId.isValid(trimmedUserId);
    if (!isValidId) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    // Ensure both user IDs are in string format
    if (trimmedUserId != String(req.user._id)) {
      console.log('Comparison failed!');
      return res.status(403).json({ message: 'Forbidden. You are not allowed to access this profile.' });
    }

    // Find the user by ID
    const user = await User.findById(trimmedUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user profile fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profession = req.body.profession || user.profession;
    user.address = req.body.address || user.address;

    await user.save();

    res.status(200).json({ message: 'User profile updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { createUser, loginUser, getUserProfile, editUserProfile };
