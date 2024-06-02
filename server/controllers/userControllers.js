const User = require("../models/userModel.js");
const HttpError = require("../models/errorModel.js");
const bcrypt = require("bcrypt");

// REGISTER A NEW USER
// POST : api/users/register
// UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check the required fields are not empty
    if (!name || !email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    // Change email address to lower case to make sure
    const newEmail = email.toLowerCase();

    // Find if the email is alreay existed in database
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }

    // If email does not exists, create user
    // Firstly, check if password is not less than 6 characters
    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters.", 422)
      );
    }
    // Secondly, check if password and confrim password are matched
    if (password !== confirmPassword) {
      return next(new HttpError("Password does not match.", 422));
    }

    // If all passes, hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Finally, create new user
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashPassword,
    });
    await res.status(201).json(`New user ${newUser.email} registered.`);
  } catch (error) {
    return next(new HttpError("User registration failed", 422));
  }
};

// LOGIN A REGISTERED USER
// POST : api/users/login
// UNPROTECTED
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check the required fields are not empty
    if (!email || password) {
      return next(new HttpError("Fill in all fields", 422));
    }

    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("Invalid credentials.", 422));
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return next(new HttpError("Invalid password.", 422));
    }

    const { _id: id, name } = user;
  } catch (error) {
    return next(
      new HttpError("Login failed. Please check your credentials.", 422)
    );
  }
};

// USER PROFILE
// POST : api/users/:id
// PROTECTED
const getUser = async (req, res) => {
  res.json("User Profile");
};

// CHANGE USER AVATAR (profile picture)
// POST : api/users/change-avatar
// PROTECTED
const changeAvatar = async (req, res) => {
  res.json("Change user avatar");
};

// EDIT USER DETAILS
// POST : api/users/edit-user
// PROTECTED
const editUser = async (req, res) => {
  res.json("Edit user details");
};

// EDIT AUTHORS
// POST : api/users/authors
// UNPROTECTED
const getAuthors = async (req, res) => {
  res.json("Get all users/authors");
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
