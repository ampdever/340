//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inventory-validation')

router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invID", invController.buildSingleItem);

router.get('/', invController.buildManagement);

// NEW FOR ADDING STUFF
router.get("/add-classification", invController.buildAddClassification);
router.get("/add-inventory", invController.buildAddInventory);
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView));


// NEW FOR EDITING THE INVENTORY
router.get(
  "/getInventory/:classification_id",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.handleAddClassification)
  )

router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.handleAddInventory)
)

router.post(
  "/update/",
  //regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteItem)
)

module.exports = router;