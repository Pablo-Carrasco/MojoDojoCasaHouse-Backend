'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Shows', [{
      title: "Buscando a Nemo",
      schedule: "14:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    },
    {
      title: "Buscando a Nemo",
      schedule: "15:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    },
    {
      title: "Buscando a Nemo",
      schedule: "12:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Shows', null, {});
  }
};

