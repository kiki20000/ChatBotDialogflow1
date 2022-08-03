const { Router } = require('express');

const dialogflowRoutes = require('./src/routes/dialogflow');

const router = Router();

router.use(dialogflowRoutes);

module.exports = router;