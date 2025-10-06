const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locations');

// GET /api/locations
// Route to fetch all available locations (for the Home screen)
router.get('/locations', locationsController.getAllLocations);

// GET /api/locations/:id
// Route to fetch a specific location's details AND its associated events (for the Detail screen)
router.get('/locations/:id', locationsController.getLocationDetailsAndEvents);

module.exports = router;
