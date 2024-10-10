const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // This next line is for the flash message on the home page - testing
  //req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

baseController.buildError = async function(req, res){
  //const nav = await utilities.getNav()
  res.render("error", {title: "Error", nav})
}

module.exports = baseController