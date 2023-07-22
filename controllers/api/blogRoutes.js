// initialize variables
const router = require('express').Router(),
      { Users, Post } = require('../../models');

/**
 * @getPosts
 * Returns all available posts from the database
 */
router.get('/posts', async (req, res) => {
  // check if code throws an error
  try {
    // find all posts
    const posts = await Post.findAll();
    // return the data
    res.json({ posts });
  }
  // catch and handle the error  
  catch (err) {
    // return status 500 and error message
    res.status(500).json({ error: 'Failed to retrieve blog posts.' });
  }
});

/**
 * @getList
 * Returns all available posts for
 * the authenticated user
 */
router.get('/list', async (req, res) => {
  // check if code throws an error
  try {
    // fetch user data with associated posts
    const userData = await Users.findAll({
      attributes: { exclude: ['password'] }, // exclude the password field 
      order: [['user_name', 'ASC']], // sort by user_name in ascending order
      include: [
        {
          model: Post, // include the post model
          include: [
            {
              model: Users, // include the users model
              attributes: ['user_name', 'email'], // only retrieve the user_name and email
            }
          ],
          where: { 
            user_id: req.session.logged_in_id // filter posts based on user_id
          } 
        },
      ],
    });
    // transform model data to plain javascript
    const users = userData.map((project) => project.get({ plain: true }));
    // return status 200 along with the user data
    res.status(200).json({ data: users });
  }
  // catch and handle the error   
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @addBlog
 * Adds a new blog post to the database
 */
router.post('/add', async (req, res) => {
  // check if code throws an error
  try {
    // create a new blog using the req.body data
    const newBlog = await Post.create({
        post_title: req.body.post_title, // title
        post_content: req.body.post_content, // content
        user_id: req.body.user_id // user id
    });
    // search for the new blog
    const foundBlog = await Post.findByPk(newBlog.id);
    // return status 200 along with the blog data and a success message
    res.status(200).json({ blog: foundBlog, message: 'Blog post added successfully.' });
  }
  // catch and handle the error    
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @updateBlog
 * Allows a user to update a blog
 * they have previously created
 */
router.put('/update/:blogId', async (req, res) => {
  // check if code throws an error
  try {
    // initialize variables
    const blogId = req.params.blogId;
    // Find the existing blog post by id
    const existingBlog = await Post.findByPk(blogId);
    // if blog post not found
    if (!existingBlog) {
      // return status 404 and error message
      return res.status(404).json({ message: 'Blog post not found.' });
    }
    // update the blog post with new values
    existingBlog.post_title = req.body.post_title;
    existingBlog.post_content = req.body.post_content;
    // save the updated blog post
    await existingBlog.save();
    // return status 200 along with the blog data and a success message
    res.status(200).json({ blog: existingBlog, message: 'Blog post updated successfully.' });
  }
  // catch and handle the error  
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @deleteBlog
 * Allows the user to delete a
 * blog that they have created
 */
router.delete('/delete/:blogId', async (req, res) => {
  // check if code throws an error
  try {
    // initialize variables
    const blogId = req.params.blogId;
    // destroy the post
    await Post.destroy(
      { where: { id: blogId } }
    );
    // return status 200 along with a success message
    res.status(200).json({ message: 'Blog post deleted successfully.' });
  }
  // catch and handle the error   
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

// export the routes
module.exports = router;