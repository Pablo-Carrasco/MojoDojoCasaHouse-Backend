'use strict';

require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Admins', [{
      name: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASSWORD,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Admins', null, {});
  }
};
