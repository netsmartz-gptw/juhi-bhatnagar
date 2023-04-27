'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true      
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    roleId: DataTypes.INTEGER.UNSIGNED,
    parentId: DataTypes.INTEGER.UNSIGNED,
    dob: DataTypes.STRING,
    gender: DataTypes.STRING,
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0      
    }
  }, {
    sequelize,
    modelName: 'Users',
    paranoid: true
  });
  return Users;
};