const { Post } = require("../models");

const postData = [
  {
    title: "First Blog Post",
    content: "Our future utopia.",
    user_id: 1,
  },
  
  {
    title: "Morals vs Ethics",
    content: "This is the content of the second blog post.",
    user_id: 2,
  },
  {
    title: "cloning",
    content: "The Good and the Bad .",
    user_id: 3,
  },
  {
    title: "Money effects",
    content: "How does money affect the outcomes?",
    user_id: 4,
  },
  
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;
