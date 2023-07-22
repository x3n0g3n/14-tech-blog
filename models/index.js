// initialize variables
const Post = require('./Post'),
      Comment = require('./Comment'),
      Users = require('./Users');

// Users: one-to-many (user has many posts)
Users.hasMany(Post, {
  foreignKey: 'user_id' // foreign key in post model referencing user_id in users model
});

// Users: one-to-many (user has many comments)
Users.hasMany(Comment, {
  foreignKey: 'user_id' // foreign key in comment model referencing user_id in users model
});

// Post: many-to-one (post belongs to a user)
Post.belongsTo(Users, {
  foreignKey: 'user_id' // foreign key in post model referencing user_id in users model
});

// Post: one-to-many (post has many comments)
Post.hasMany(Comment, {
  foreignKey: 'post_id', // Foreign key in Comment model referencing post_id in Post model
  onDelete: 'CASCADE' // when a post is deleted, all associated comments are also deleted
});

// Comment: many-to-one (comment belongs to a user)
Comment.belongsTo(Users, {
  foreignKey: 'user_id' // foreign key in comment model referencing user_id in users model
});

// Comment: many-to-one (comment belongs to a post)
Comment.belongsTo(Post, {
  foreignKey: 'post_id' // foreign key in comment model referencing post_id in post model
});

// Export the models
module.exports = { Post, Comment, Users };