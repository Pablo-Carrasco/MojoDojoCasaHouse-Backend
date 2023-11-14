'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Cinemas', [{
      name: 'Cineplanet La Dehesa',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.3568727 -70.5169774)'),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Cinemas', null, {});
  }
};