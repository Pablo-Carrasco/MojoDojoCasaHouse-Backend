'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Shows', [{
      title: "Barbie",
      schedule: "11:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-25")
    },
    {
      title: "Barbie",
      schedule: "13:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-25")
    },
    {
      title: "Barbie",
      schedule: "12:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-25")
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Shows', null, {});
  }
};
