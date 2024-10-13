const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  get item view
 * ************************** */
invCont.buildSingleItem = async function (req, res, next) {
  const invID = req.params.invID
  const data = await invModel.getSpecificItem(invID)
  const grid = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  res.render("./inventory/inventoryDetail", {
    title: "vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  NEW FOR ADDING STUFF - Build Mangement View and other things
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  //these locations are relative to the views folder
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
  })
}

/* ****************************************
*  NEW FOR ADDING STUFF
* *************************************** */
invCont.handleAddClassification = async function (req, res) {
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name)

  //moved this line here so the Nav is built after the new classification was submitted
  let nav = await utilities.getNav()

  // If there aren't any rows returned then we are going to be passed through to the error
  if (regResult.rows) {
    req.flash(
      "notice",
      `${classification_name} was added successfully`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

invCont.handleAddInventory = async function (req, res) {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const regResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  //moved this line here so the Nav is built after the new classification was submitted
  let nav = await utilities.getNav()

  // If there aren't any rows returned then we are going to be passed through to the error
  if (regResult.rows) {
    req.flash(
      "notice",
      `The ${inv_model} was added successfully`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    })
  }
}

module.exports = invCont