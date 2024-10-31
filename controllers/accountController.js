const accountModel = require("../models/account-model")
const utilities = require('../utilities')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

async function goodLogin(req, res, next) {
  let nav = await utilities.getNav()
  
  res.render("account/goodLogin", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Update",
    nav,
    accountData: res.locals.accountData,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
 *  Updating account information
 * ************************************ */
 async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {account_firstname, account_lastname, account_email, account_id} = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

  if(updateResult) {
    req.session.account_firstname = account_firstname
    req.session.accountData = {
      ...req.session.accountData,
      account_firstname,
      account_lastname,
      account_email
    }
    res.locals.accountData = req.session.accountData
    req.flash("notice", `Your account was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry unable to update.")
  }
}

/* ****************************************
 *  Updating password
 * ************************************ */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
      const updateResult = await accountModel.updatePassword(hashedPassword, account_id)
  } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/account", {
      title: "Edit Account",
      nav,
      errors: null,
      })
  }

  const regResult = await accountModel.registerAccount(hashedPassword, account_id)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you updated your password.`
    )
    res.status(201).render("account/account", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/account", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }
}
  
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, goodLogin, buildUpdate, updateAccount, updatePassword}


  // $2a$10$iDLfW7azXG8sWd4hOkpgc.9li6mZU4pi30cUmZ7SnOT.7RW5oXqfi
  // $2a$10$iDLfW7azXG8sWd4hOkpgc.9li6mZU4pi30cUmZ7SnOT.7RW5oXqfi
  // $2a$10$iDLfW7azXG8sWd4hOkpgc.9li6mZU4pi30cUmZ7SnOT.7RW5oXqfi
  // $2a$10$mlatD0oB4414E3MSaAvm1.1HkcEyJXlJ2E1WCMxIDSTNqPYsApM9e
  // $2a$10$C8Lp4x1zL4sdFam723DhsOe.FxiQhkY5sB1cwHtfF5kGtpfInOa2.