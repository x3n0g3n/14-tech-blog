const { Comment } = require("../models");

const commentData = [
  {
    comment_text: "intresting concept!",
    user_id: 1,
    post_id: 1,
  },
  {
    comment_text: "I agree with you!",
    user_id: 2,
    post_id: 1,
  },
  {
    comment_text: "I disagree, the ethics alone!",
    user_id: 3,
    post_id: 1,
  },
  {
    comment_text: "I think you might have a point?!",
    user_id: 4,
    post_id: 1,
  },
  {
    comment_text: "Technology pulls people away from religion!",
    user_id: 5,
    post_id: 1,
  },
  {
    comment_text: "Good article, great writing!",
    user_id: 1,
    post_id: 2,
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
