const router = require('express').Router(),
      { Users, Comment } = require('../../models');

  /**
 * @addComment
 * Allows the user to add a comment
 * to a blog post
 */
router.post('/add', async (req, res) => {
  // check if code throws an error
  try {
    // create a new comment
    const newComment = await Comment.create({
        comment_content: req.body.comment_content, // comment body
        user_id: req.body.user_id, // user id
        post_id: req.body.post_id // post id
    });
    // find the new comment
    const foundComment = await Comment.findByPk(newComment.id);
    // return status 200 along with the comment data and a success message
    res.status(200).json({ comment: foundComment, message: 'Comment added successfully.' });
  }
  // catch and handle the error   
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @getComments
 * Gets the comments for the current
 * blog that is loaded
 */
router.get('/getComments/:blogId', async (req, res) => {
  // check if code throws an error
  try {
    // initialize variables
    const { blogId } = req.params;
    // fetch comments data for the specified blogId
    const commentsData = await Comment.findAll({
      where: { post_id: blogId },
      include: [{ model: Users, attributes: ['user_name'] }],
    });
    // return status 200 along with the comments data
    res.status(200).json(commentsData);
  }
  // catch and handle the error    
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

// export the routes
module.exports = router;
