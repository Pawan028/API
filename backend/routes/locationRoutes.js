const express = require('express');
const { getLocations, addLocation, deleteLocation, updateLocation, checkLocation } = require('../controllers/locationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, admin, getLocations)
  .post(protect, admin, addLocation);

router.route('/:id')
  .delete(protect, admin, deleteLocation)
  .put(protect, admin, updateLocation);

router.route('/check')
  .post(checkLocation);

module.exports = router;
