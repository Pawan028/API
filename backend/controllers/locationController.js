const asyncHandler = require('../middleware/asyncHandler'); // Adjust path as necessary
const Location = require('../models/locationModel');

// Get all locations
const getLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find({});
  res.json(locations);
});

// Add a new location
const addLocation = asyncHandler(async (req, res) => {
  const { city, state, pincode } = req.body;
  const location = new Location({ city, state, pincode });
  const createdLocation = await location.save();
  res.status(201).json(createdLocation);
});

// Delete a location by ID
const deleteLocation = asyncHandler(async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (location) {
      await Location.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove
      res.json({ message: 'Location removed' });
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a location by ID
const updateLocation = asyncHandler(async (req, res) => {
  const { city, state, pincode } = req.body;
  const location = await Location.findById(req.params.id);
  if (location) {
    location.city = city;
    location.state = state;
    location.pincode = pincode;
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } else {
    res.status(404).json({ message: 'Location not found' });
  }
});

// Check if a location exists by pincode
const checkLocation = asyncHandler(async (req, res) => {
  const { pincode } = req.body;
  const location = await Location.findOne({ pincode });
  if (location) {
    res.json({ available: true });
  } else {
    res.json({ available: false });
  }
});

module.exports = {
  getLocations,
  addLocation,
  deleteLocation,
  updateLocation,
  checkLocation
};
