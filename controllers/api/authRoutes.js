// initialize variables
const router = require('express').Router(),
      { Users } = require('../../models');

/**
 * @createUser
 * creates a new user on sign up
 */
router.post('/create', async (req, res) => {
  // check if code throws an error
  try {
    // create a new user
    const newUser = await Users.create({
      user_name: req.body.user_name, // user name
      email: req.body.email, // email
      password: req.body.password // password
    }),
    // get the updated user data
    userData = await Users.findOne({ where: { email: newUser.email } });
    req.session.save(() => { // save the session details
      req.session.logged_in_id = userData.id; // logged in id
      req.session.logged_in = true; // logged in true
      res.json({ user: userData, message: 'Successful login.' }); // return user data and success message
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
 * authenticates the user
 */
router.post('/login', async (req, res) => {
  // check if code throws an error
  try {
    // search for user based on their username
    const userData = await Users.findOne({ where: { user_name: req.body.username } });
    // if user not found
    if (!userData) {
      // return status 400 and error message
      res.status(400).json({ error: 'Username is not registered. Please sign up.' });
      // return
      return;
    }
    // check if password is valid
    const validPassword = await userData.checkPassword(req.body.password);
    // if password is invalid
    if (!validPassword) {
      // return status 400 and error message
      res.status(400).json({ error: 'Incorrect password.' });
      // return
      return;
    }
    // set the session data
    req.session.logged_in_id = userData.id;
    req.session.logged_in = true;
    // save the session
    req.session.save((err) => {
      // if there is an error
      if (err) {
        // return status 400 and error message
        res.status(400).json({ error: 'An error occurred while saving the session.' });
        // return
        return;
      }
      // else, return status 200 and success message
      res.status(200).json({ message: 'You are now logged in.' });
    });
  } 
  // catch and handle the error
  catch (err) {
    // return status 500 and error message
    res.status(500).json(err);
  }
});

/**
 * @logout
 * Logs the user out
 */
router.get('/logout', (req, res) => {
  // if the user is logged in
  if (req.session.logged_in) {
    // destroy the session
    req.session.destroy(() => {
      // session destroyed successfully, return status 204
      res.status(204).end();
    });
  }
  // if the user is not logged in 
  else {
    // return status 404
    res.status(404).end();
  }
});

// export the routes
module.exports = router;
