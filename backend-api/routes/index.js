const express = require('express');
const authRouter = require('./auth');
const marketRouter = require('./mandi_api')

const router = express.Router();

router.use('/auth', authRouter);
router.use('/market', marketRouter);



module.exports = router;