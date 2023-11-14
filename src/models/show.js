'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Show extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Show.belongsTo(models.Cinema, {
        foreignKey: 'id_cinema',
        as: 'cinema',
      })
    }
  }
  Show.init({
    title: DataTypes.STRING,
    schedule: DataTypes.TIME,
    link_to_show: DataTypes.TEXT,
    link_to_picture: DataTypes.TEXT,
    id_cinema: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Show',
  });
  return Show;
};