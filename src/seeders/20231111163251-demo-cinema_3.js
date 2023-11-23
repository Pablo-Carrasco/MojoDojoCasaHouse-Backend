'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Cinemas', [{
      name: 'CP La Dehesa',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.35671584325781 -70.51447220673296)'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CP Costanera',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.4179438208168 -70.60666130457803)'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CP Florida',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.50956499756472 -70.60869425856596)'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CINEMARK ALTO LAS CONDES',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.39099201668575 -70.54497919267627)'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CINEMARK MALLPLAZA VESPUCIO',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.51680722864912 -70.59739130431745)'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Cinemas', null, {});
  }
};