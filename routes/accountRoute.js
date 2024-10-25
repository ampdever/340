const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.goodLogin))

router.get("/account", utilities.handleErrors(accountController.buildUpdate))

router.get("/logout", (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
})

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
///////////////////// This was what we used without the Jwt. 
// router.post(
//     "/login",
//     (req, res) => {
//       res.status(200).send('login process')
//     }
//   )

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.post(
  "/account",
  //regValidate.loginRules(),
  //regValidate.checkLoginData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/edit",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccount,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/password",
  regValidate.updateAccountPasswordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;

//// showing the differences of the cookies after successfull logins
// client - yGG7lJuQftjo82ZpzyUU8
// employee - QZN_xTF8XpxxjgdGU
// admin - xYcB_GhY-WTyVc