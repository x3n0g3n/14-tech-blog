// Import the required modules
const router = require("express").Router();
const userRoutes = require("./user-routes");
const postRoutes = require("./post-routes");
const commentRoutes = require("./comment-routes");

// Set up the routes
router.use("/users", userRoutes); //  for user-
router.use("/posts", postRoutes); //  for post- 
router.use("/comments", commentRoutes); //  for comment-

// Export the router
module.exports = router;
