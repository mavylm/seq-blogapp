'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      models.Post.hasMany(models.Comment, {
        as: 'comments',
        foreignKey: 'post_id',
      });
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
