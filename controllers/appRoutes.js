// initialize variables
const router = require('express').Router(),
      { Users, Post, Comment } = require('../models'),
      withAuth = require('../utils/auth');
/**
 * @homePageRoute
 * Redirects the user to the home page
 */
router.get('/', async (req, res) => {
  // check if code throws an error
  try {
    // get all posts from the database to populate the home page
    const postData = await Post.findAll({
      order: [['post_date', 'DESC']], // order by post_date, descending
      include: [
        {
          model: Users, // include user model
          attributes: ['user_name', 'email'], // return user_name and email
        },
        {
          model: Comment, // include comment model
          include: [
            {
              model: Users, // include users model
              attributes: ['user_name', 'email'], // return user_name and email
            },
          ],
        },
      ],
    });
    // transform post data into javascript object
    const posts = postData.map((post) => post.get({ plain: true }));
    // render home.handlebars
    res.render('home', {
      posts, // blog data
      logged_in: req.session.logged_in, // logged in session
      logged_in_id: req.session.logged_in_id, // logged in session id
      url: req.url, // current url path
      postId: req.params.postId, // post id
    });
  }
  // catch and handle the error 
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @dashboardRoute
 * Redirects the user to the dashboard. withAuth
 * redirects the user to login before accessing the
 * dashboard if they are not currently authenticated
 */
router.get('/dashboard', withAuth, async (req, res) => {
  // check if code throws an error
  try {
    // find all posts created by the authenticated user
    const userData = await Users.findAll({
      attributes: { exclude: ['password'] }, // exclude password
      order: [['user_name', 'ASC']], // sort by user_name, ascending
      include: [
        {
          model: Post, // include post model
          include: [
            {
              model: Users, // include users model
              attributes: ['user_name', 'email'], // return user_name and email
            }
          ],
          // where user_id === authenticated users id
          where: { user_id: req.session.logged_in_id }
        },
      ],
    });
    // transform user data into javascript object
    const users = userData.map((user) => user.get({ plain: true }));
    // render dashboard.handlebars
    res.render('dashboard', {
      users, // blog data
      logged_in: req.session.logged_in, // logged in session
      logged_in_id: req.session.logged_in_id, // logged in session id
      url: req.url, // current url path
      updatingBlog: false //changes what is displayed on the dashboard 
    });
  }
  // catch and handle the error  
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @dashboardSinglePostRoute
 * Sets updatingBlog true to display the
 * update section on the dashboard. Gets the post
 * details when the user clicks on a post title
 * to edit or delete
 */
router.get('/dashboard/:postId', withAuth, async (req, res) => {
  // check if code throws an error
  try {
    // retrieve the post by ID from the database
    const postData = await Post.findByPk(req.params.postId, {
      include: [
        {
          model: Users, // include users model
          attributes: ['user_name', 'email'], // include user_name and email
        }
      ],
    });
    // if no post is found
    if (!postData) {
      // return status 404 and error message
      return res.status(404).json({ error: 'Post not found' });
    }
    // transform user data into javascript object
    const users = postData.get({ plain: true });
    // render dashboard.handlebars
    res.render('dashboard', {
      users, // blog data
      logged_in: req.session.logged_in, // logged in session
      logged_in_id: req.session.logged_in_id, // logged in session id
      url: req.url, // current url path
      updatingBlog: true //changes what is displayed on the dashboard 
    });
  }
  // catch and handle the error   
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @getPostDetails
 * gets the post details and renders a
 * post page when the user clicks on a 
 * title in the homepage
 */
router.get('/posts/:id', async (req, res) => {
  // check if code throws an error
  try {
    // initialize variables
    const postId = req.params.id;
    // retrieve the post by ID from the database
    const postData = await Post.findByPk(postId, {
      include: [
        {
          model: Users, // include users model
          attributes: ['user_name', 'email'], // include user_name and email
        },
        {
          model: Comment, // include comment model
          include: [
            {
              model: Users, // include users model
              attributes: ['user_name', 'email'], // include user_name and email
            },
          ],
        },
      ],
    });
    // if no post is found
    if (!postData) {
      // return status 404 and error message
      return res.status(404).json({ error: 'Post not found' });
    }
    // transform user data into javascript object
    const post = postData.get({ plain: true });
    // render post.handlebars
    res.render('post', {
      post, // blog data
      logged_in: req.session.logged_in, // logged in session
      logged_in_id: req.session.logged_in_id, // logged in session id
      url: req.url // current url path
    });
  }
  // catch and handle the error   
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @login
 * render login page
 */
router.get('/login', (req, res) => {
  // render login.handlebars
  res.render('login', {
    url: req.url // current url path
  });
});

// export the routes
module.exports = router;
