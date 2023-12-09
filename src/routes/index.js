const express = require('express');
const router = express.Router();

const baseRoutes = require('./base.routes');
const apiRoutes = require('./apiRoutes.routes');
const adminRoutes = require('./admin.routes')

router.use('/', baseRoutes);
router.use('/api', apiRoutes);
router.use('/admin', adminRoutes)

module.exports = router;