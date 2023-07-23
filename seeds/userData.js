const { User } = require("../models");
const userData = [
  {
    username: "bunny",
    email: "killa@example.com",
    password: "apple",
  },
  {
    username: "tiger",
    email: "peanut@example.com",
    password: "banana",
  },
  {
    username: "kitty",
    email: "mouse@example.com",
    password: "catcus",
  },
  {
    username: "adrena",
    email: "hijinx@example.com",
    password: "datacode",
  },

];
const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
