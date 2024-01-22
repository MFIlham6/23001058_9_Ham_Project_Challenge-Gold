'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });

  users.associate = function(models){
    users.hasMany(models.orders, {
      foreignKey:'user_id', as: 'orders'
    })
  }

  users.associate = function(models){
    users.hasMany(models.items, {
      foreignKey:'user_id', as: 'items'
    })
  }

  return users;
};