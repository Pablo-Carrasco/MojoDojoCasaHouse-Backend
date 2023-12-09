const express = require('express');
const router = express.Router();
const db = require("../config/db.js");

router.get('/', async (req, res) => {
  try {
    if (!db.Admin) {
        throw new Error('Modelo Admin no definido en el objeto db');
      }
  
      const admins = await db.Admin.findAll();

    // Crear una lista de administradores
    const adminsList = admins.map(admin => ({
      name: admin.name,
      password: admin.password,
      // Agrega cualquier otro campo que desees incluir en la lista
    }));

    res.json(adminsList);
  } catch (error) {
    console.error('Error al obtener administradores', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
