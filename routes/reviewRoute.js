const express = require('express');
const router = new express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities/');

// Middleware to make sure the user is logged in
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.loggedin) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Route to add a new review (only accessible by logged-in users)
router.get("/add-review", reviewController.buildAddReview);

router.post(
    "/add",
    utilities.handleErrors(reviewController.handleAddReview)
  )

module.exports = router;
