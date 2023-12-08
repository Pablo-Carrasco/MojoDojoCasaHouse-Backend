'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Cinemas', [{
      name: 'CP La Dehesa',
      chain: 'CP',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.35671584325781 -70.51447220673296)'),
      address: 'Av. La Dehesa 1526, Lo Barnechea',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CP Costanera',
      chain: 'CP',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.4179438208168 -70.60666130457803)'),
      address: 'Av. Andrés Bello 2425, Providencia',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CINEMARK ALTO LAS CONDES',
      chain: 'CM',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.39099201668575 -70.54497919267627)'),
      address: 'Av. Pdte. Kennedy 9001, Las Condes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cinépolis Casa Costanera',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.398469519281626 -70.59850637793684)'),
      address:'Av. Nueva Costanera 3900, Vitacura',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cinépolis La Reina',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.44724529659722 -70.57087541997439)'),
      address:'Av. Ossa 655, La Reina',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cinépolis Mallplaza Egaña',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.45248656962951 -70.57037394327618)'),
      address:'Av. Larraín 5862, La Reina',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cinépolis Mallplaza Egaña Premium Class',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.45248656962951 -70.57037394327618)'),
      address:'Av. Larraín 5862, La Reina',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cinépolis Mallplaza Los Dominicos',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.41508169946311 -70.5412874083331)'),
      address:'Av. Padre Hurtado Sur 875, Las Condes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cinépolis Mallplaza Los Dominicos Premium Class',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.41508169946311 -70.5412874083331)'),
      address:'Av. Padre Hurtado Sur 875, Las Condes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cinépolis Paseo Los Trapenses',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.34326412069116 -70.54511895768853)'),
      address:'Cam. Los Trapenses 3515, Lo Barnechea',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Parque Arauco',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.40188793771994 -70.57858716010362)'),
      address:'Av. Pdte. Kennedy 5413, Las Condes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Parque Arauco Premium Class',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.40188793771994 -70.57858716010362)'),
      address:'Av. Pdte. Kennedy 5413, Las Condes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Paseo Los Dominicos (San Carlos)',
      chain: 'CH',
      location: Sequelize.fn('ST_GeomFromText', 'POINT(-33.40108704642186 -70.51469686163979)'),
      address:'Cam. El Alba 11969, Las Condes',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Cinemas', null, {});
  }
};