'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User, {
        as: 'commenter',
        foreignKey: 'user_id',
      });
      models.Comment.belongsTo(models.Post, {
        as: 'post',
        foreignKey: 'post_id',
      });
    }
  }
  Comment.init(
    {
      body: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
