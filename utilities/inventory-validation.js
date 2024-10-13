const utilities = require(".")
const {body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")


/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .matches("^[A-Za-z]+$")
        .withMessage("Please provide a classification name as per the instructions."), // on error this message is sent.
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name
      })
      return
    }
    next()
  }

// ===================================================================================================================
// classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
      // firstname is required and must be string
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .matches("^[A-Za-z]+$")
        .withMessage("Please provide a classification name as per the instructions."), // on error this message is sent.

      // lastname is required and must be string
      body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the make of the car"), // on error this message is sent.
   
        // lastname is required and must be string
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide the model of the car"), // on error this message is sent.   

        // lastname is required and must be string
      body("inv_decription")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a description of the car"), // on error this message is sent.
      
      // lastname is required and must be string
      body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide an image of the car"), // on error this message is sent.

      // lastname is required and must be string
      body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a thumbnail of the car"), // on error this message is sent.

      // lastname is required and must be string
      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide the price of the car"), // on error this message is sent.

      // lastname is required and must be string
      body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide the year of the car"), // on error this message is sent.

      // lastname is required and must be string
      body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide the miles of the car"), // on error this message is sent.

      // lastname is required and must be string
      body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the color of the car"), // on error this message is sent.
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
  }

module.exports = validate