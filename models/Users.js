// initialize variables
const { Model, DataTypes } = require('sequelize'),
      bcrypt = require('bcrypt'),
      sequelize = require('../config/connection');

// users model definition
class Users extends Model {
  // validate the password
  checkPassword(loginPw) {
    // use bcrypt to compare the login password with the saved hashed password
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// initialize the model with attributes and options
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'users',
  }
);

module.exports = Users;
