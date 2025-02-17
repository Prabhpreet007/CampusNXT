// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image: String,  // URL of the image
  title: String,
  description: String,
  requirements: String,
  date: String,  // You can also use Date type if you want
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
