cont router = require('express').Router();

const clothingItem = require('./clothingItem');
const user = require('./user');

router.use('/clothingItem', clothingItem);
router.use('/user', user);