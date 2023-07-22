// initialize variables
const sequelize = require('../config/connection'),
      { Users, Post, Comment } = require('../models'),
      userData = require('./userData.json'),
      postData = require('./postData.json'),
      commentData = require('./commentData.json');

// seed the database with initial data
const seedDatabase = async () => {
  // disable foreign key checks temporarily
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

  // sync the models with the database and force the tables to be recreated
  await sequelize.sync({ force: true });

  // create and seed the Users table
  await Users.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // create and seed the Post table
  await Post.bulkCreate(postData, {
    individualHooks: true,
    returning: true,
  });

  // create and seed the Comment table
  await Comment.bulkCreate(commentData, {
    individualHooks: true,
    returning: true,
  });

  // enable foreign key checks again
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

  // exit the process
  process.exit(0);
};

// call the seedDatabase function to initiate the seeding process
seedDatabase();