'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Shows', [{
      title: "BUSCANDO A NEMO",
      schedule: "14:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "https://lumiere-a.akamaihd.net/v1/images/p_findingnemo_19752_05271d3f.jpeg?region=0%2C0%2C540%2C810",
      id_cinema: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    },
    {
      title: "BUSCANDO A NEMO",
      schedule: "15:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "https://lumiere-a.akamaihd.net/v1/images/p_findingnemo_19752_05271d3f.jpeg?region=0%2C0%2C540%2C810",
      id_cinema: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    },
    {
      title: "BUSCANDO A NEMO",
      schedule: "12:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "https://lumiere-a.akamaihd.net/v1/images/p_findingnemo_19752_05271d3f.jpeg?region=0%2C0%2C540%2C810",
      id_cinema: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    },
    {
      title: "JUEGOS DEL HAMBRE: BALADA PÁJAROS CANTORES",
      schedule: "14:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "https://cdn.apis.cineplanet.cl/CDN/media/entity/get/FilmPosterGraphic/HO00001103?referenceScheme=HeadOffice&allowPlaceHolder=true",
      id_cinema: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    },
    {
      title: "JUEGOS DEL HAMBRE: BALADA PÁJAROS CANTORES",
      schedule: "16:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "https://cdn.apis.cineplanet.cl/CDN/media/entity/get/FilmPosterGraphic/HO00001103?referenceScheme=HeadOffice&allowPlaceHolder=true",
      id_cinema: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    },
    {
      title: "JUEGOS DEL HAMBRE: BALADA PÁJAROS CANTORES",
      schedule: "19:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "https://cdn.apis.cineplanet.cl/CDN/media/entity/get/FilmPosterGraphic/HO00001103?referenceScheme=HeadOffice&allowPlaceHolder=true",
      id_cinema: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Shows', null, {});
  }
};

