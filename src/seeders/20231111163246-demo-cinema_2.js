'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Cinemas', [{
      name: 'Cine Hoyts Parque Arauco',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.4020268 -70.5812211)'),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Cinemas', null, {});
  }
};
