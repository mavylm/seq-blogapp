'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Posts', 'category', {
      type: Sequelize.STRING,
    });
  },
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Posts', 'category');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
