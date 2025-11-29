const express = require('express');
const router = express.Router();
const { sendConnectionRequest, getMyConnections, respondToRequest } = require('../controllers/connection.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/request/:userId', sendConnectionRequest);
router.get('/', getMyConnections);
router.put('/:id', respondToRequest);

module.exports = router;