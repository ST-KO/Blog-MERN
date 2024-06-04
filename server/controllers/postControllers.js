const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel.js");

// CREATE A POST
// POST : api/posts
// PROTECTED
const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;
    if (!title || !category || !description || !req.files) {
      return next(
        new HttpError("Fill in all fields and choose thumbnail", 422)
      );
    }
    const { thumbnail } = req.files;

    // Check the file size
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Thumbnail too big. File should be less than 2mb")
      );
    }

    let fileName = thumbnail.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFilename),
      async (error) => {
        if (error) {
          return next(new HttpError(error));
        } else {
          const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFilename,
            creator: req.user.id,
          });

          if (!newPost) {
            return next(new HttpError("Post couldn't be created.", 422));
          }

          // Find user and increase post count by 1
          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// Get All POSTS
// POST : api/posts
// UNPROTECTED
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 }); // to get the latest one first, "-1" means get them in descending order
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// Get SINGLE POSTS
// GET : api/posts/:id
// UNPROTECTED
const getSinglePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    // Above code can also be written like this
    // const { id } = req.params;
    // const post = await Post.findById(id);

    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// Get POSTS BY CATEGORY
// GET : api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPost = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// Get POSTS BY AUTHORS
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// UPDATE POSTS
// PATCH : api/posts/:id
// PROTECTED
const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFilename;
    let updatedPost;
    const postId = req.params.id;
    let { title, category, description } = req.body;

    // ReactQuill has a paragraph opening and closing tag with a break tag in between so there are 11 characters in there already.
    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    // Get old post from database
    const oldPost = await Post.findById(postId);

    // First check that the post belongs to the correct user by comparing user id and creator id
    // If want to check strictly with "===" instead of "=="
    // first convert "oldPost.creator" to string "oldPost.creator.toString())"
    // because "req.user.id" is String when "oldPost.creator" is Object
    if (req.user.id === oldPost.creator.toString()) {
      if (!req.files) {
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          {
            title,
            category,
            description,
          },
          { new: true }
        );
      } else {
        // Delete the old thumbnail
        fs.unlink(
          path.join(__dirname, "..", "uploads", oldPost.thumbnail),
          async (err) => {
            if (err) {
              return next(new HttpError(err));
            }
          }
        );

        // Upload new thumbnail......
        const { thumbnail } = req.files;
        // Check the file size is bigger than 2MB first
        if (thumbnail.size > 2000000) {
          return next(
            new HttpError("Thumbnail too big. Should be less than 2mb")
          );
        }

        fileName = thumbnail.name;
        let splittedFileName = fileName.split(".");
        newFilename =
          splittedFileName[0] +
          uuid() +
          "." +
          splittedFileName[splittedFileName.length - 1];

        thumbnail.mv(
          path.join(__dirname, "..", "uploads", newFilename),
          async (err) => {
            if (err) {
              return next(new HttpError(err));
            }
          }
        );

        updatedPost = await Post.findByIdAndUpdate(
          postId,
          {
            title,
            category,
            description,
            thumbnail: newFilename,
          },
          { new: true }
        );
      }

      // Check if the editing/uploading works as intended
      if (!updatedPost) {
        return next(new HttpError("Couldn't upload post., 400"));
      }

      // If all good send that newly updated post to user
      res.status(200).json(updatedPost);
    } else {
      return next(new HttpError("Post couldn't be updated.", 403));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

// DELETE POSTS
// DELETE : api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return next(new HttpError("Post unavailable.", 400));
    }

    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;

    // First check that the post belongs to the correct user by comparing user id and creator id
    if (req.user.id == post.creator) {
      // Delete thumbnail from uploads folder
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);

            // Find user and decrease post counts by 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
            res.status(200).json(`Post ${postId} deleted successfully`);
          }
        }
      );
    } else {
      return next(new HttpError("Post couldn't be deleted.", 403));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getSinglePost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
