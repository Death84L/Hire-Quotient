const Post = require('../models/postModel');


const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content,
      author: req.user._id, // Associate the post with the authenticated user
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name'); // Populate author field with user's name

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID and populate the author field with user's name
    const post = await Post.findById(postId).populate('author', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const addCommentToPost = async (req, res) => {
  try {
    const { description } = req.body;
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Add a comment to the post
    post.comments.push({
      user: req.user._id, // Associate the comment with the authenticated user
      description,
    });

    await post.save();

    res.status(201).json({ message: 'Comment added to the post.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Other controller functions...

module.exports = { createPost, getAllPosts, getPostById, addCommentToPost, /* Other controller functions... */ };
