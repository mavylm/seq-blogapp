'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint('Posts', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'user_id',
      references: {
        table: 'Users',
        field: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.addConstraint('Posts', 'user_id');
  },
};
