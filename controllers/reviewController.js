// reviewController.js
const reviewModel = require('../models/review-model'); 
const utilities = require("../utilities/")
const reviewCont = {}


reviewCont.getReviewsJson = async (req, res, next) => {
    const account_id = parseInt(req.params.account_id)
    const allReviews = await reviewModel.getReviewsByAccount(account_id)
    if(allReviews[0].review_id) {
        return res.json(allReviews)
    } else {
        next(new Error("No reviews returned"))
    }
}

reviewCont.buildAddReview = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("review/add-review", {
      title: "Add Review",
      nav,
      errors: null,
    })
  }


reviewCont.handleAddReview = async function (req, res) {
    const { review_text, inv_id, account_id,  } = req.body

    const newDate = new Date();
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    const review_date = newDate.toLocaleDateString('en-US', options);
  
    const regResult = await reviewModel.addReview(review_text, review_date, inv_id, account_id)
  
    //moved this line here so the Nav is built after the new classification was submitted
    let nav = await utilities.getNav()

    // If there aren't any rows returned then we are going to be passed through to the error
    if (regResult) {
      req.flash(
        "notice",
        `The review was added successfully`
      )
      res.status(201).render("review/add-review", {
        title: "Add Review",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, adding the review failed.")
      res.status(501).render("inventory/add-inventory", {
        title: "New Inventory",
        nav,
        errors: req.flash(),
        review_text,
        inv_id,
        account_id
      })
    }
  }

module.exports = reviewCont
