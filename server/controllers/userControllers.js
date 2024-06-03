const User = require("../models/userModel.js");
const HttpError = require("../models/errorModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

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
    res.status(201).json(`New user ${newUser.email} registered.`);
  } catch (error) {
    return next(new HttpError("User registration failed", 422));
  }
};

// LOGIN A REGISTERED USER
// POST : api/users/login
// UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check the required fields are not empty
    if (!email || !password) {
      return next(new HttpError("Fill in all fields", 422));
    }

    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("Invalid credentials.", 422));
    }

    // Compare the user input password with created password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return next(new HttpError("Invalid password.", 422));
    }

    // If password is correct, then create token
    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login failed. Please check your credentials.", 422)
    );
  }
};

// USER PROFILE
// POST : api/users/:id
// PROTECTED
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get user from database
    const user = await User.findById(id).select("-password"); // Get user data except password

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// CHANGE USER AVATAR (profile picture)
// POST : api/users/change-avatar
// PROTECTED
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image.", 422));
    }

    // Find user from database
    const user = await User.findById(req.user.id);

    // Delete old avatar if exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    const { avatar } = req.files;
    // check if file size bigger than 500KB
    if (avatar.size > 500000) {
      return next(
        new HttpError(
          "Provided picture is too big. Should be less than 500kb",
          422
        )
      );
    }

    // Change the filename
    let fileName = avatar.name;
    let splittedFileName = fileName.split(".");
    let newFilName =
      splittedFileName[0] +
      uuid() +
      "." +
      splittedFileName[splittedFileName.length - 1];

    // Upload the file
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFilName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFilName },
          { new: true }
        );

        if (!updatedAvatar) {
          return next(new HttpError("Avatar couldn't be changed.", 422));
        }
        res.status(200).json(updatedAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// EDIT USER DETAILS
// POST : api/users/edit-user
// PROTECTED
const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    // Check if required fileds are not empty
    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError("Fill in all fileds", 422));
    }

    // Get user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    // Make sure new email doesn't already exist
    const emailExists = await User.findOne({ email });
    // Make sure we are not chaging someone else's email by checking the id
    if (emailExists && emailExists._id != req.user.id) {
      return next(new HttpError("Email already exist.", 422));
    }

    // Compare current password with database password
    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return next(new HttpError("Invalid current password"), 422);
    }

    // Compare new new password with confrim password
    if (newPassword !== confirmNewPassword) {
      return next(new HttpError("New passwords do not match.", 422));
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update user info in database
    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        passwrod: hashPassword,
      },
      { new: true }
    );

    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// EDIT AUTHORS
// POST : api/users/authors
// UNPROTECTED
const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password"); // Get all users without their password

    res.status(200).json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
