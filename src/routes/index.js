const express = require('express');
const router = express.Router();

const baseRoutes = require('./base.routes');
const apiRoutes = require('./apiRoutes.routes');

router.use('/', baseRoutes);
router.use('/api', apiRoutes);

module.exports = router;