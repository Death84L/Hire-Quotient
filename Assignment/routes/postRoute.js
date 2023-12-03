const express = require('express');
const router = express.Router();
const PostController = require('../Controllers/postController');
const authenticateUser = require('../Middleware/authMiddleware');

// Create a new post (Requires authentication)
router.post('/create', authenticateUser, PostController.createPost);

// Get all posts
router.get('/', PostController.getAllPosts);

// Get a specific post
router.get('/:postId', PostController.getPostById);

// Add a comment to a post (Requires authentication)
router.post('/:postId/comment', authenticateUser, PostController.addCommentToPost);

module.exports = router;
