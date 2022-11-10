const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const flash = require('../utils/Flash');

const User = require('../models/User');

exports.signupGetController = (req,res,next) => {
  res.render('../views/pages/auth/signup.ejs', 
  {
    title: 'Create a new accont', 
    error: {}, 
    value: {},
    flashMessage: flash.getMessage(req)
  })
}

exports.signupPostController = async (req,res,next) => {
  let {username, email, password} = req.body;

  let errors = validationResult(req).formatWith(errorFormatter)
  if(!errors.isEmpty()) {
    req.flash('fail', 'Something wrong! check your form')
    return res.render('../views/pages/auth/signup.ejs', { 
      title: 'Create a new account', 
      error: errors.mapped(), 
      value: {
        username, email, password
      },
      flashMessage: flash.getMessage(req)
    })
  }

  try {    
  let hashedPassword = await bcrypt.hash(password, 11)

  let user = new User({
    username,
    email,
    password : hashedPassword
  })
    await user.save()
    req.flash('success', 'User created succefully!')
    res.redirect('/auth/login')
  } catch (error) {
    next(error)
  }
}

exports.loginGetController = (req,res,next) => { 

  res.render('../views/pages/auth/login.ejs', 
  {
    title: 'Login to your account', 
    error: {}, 
    value: {},
    flashMessage: flash.getMessage(req)
  })
}

exports.loginPostController = async (req,res,next) => {
  let {email, password} = req.body
  let errors = validationResult(req).formatWith(errorFormatter);
  if(!errors.isEmpty()) {
    req.flash('fail', 'Something wrong! check your form')
    return res.render('../views/pages/auth/login.ejs', 
    {
      title: 'Login to your account', 
      error: errors.mapped(),
      flashMessage: flash.getMessage(req)
    })
  }
  try {
    let user = await User.findOne({email})

    if(!user) {
      req.flash('fail', 'Provide your valid email')
      return res.render('../views/pages/auth/login.ejs', 
      {
        title: 'Login to your account', 
        error: {},
        flashMessage: flash.getMessage(req)
      })
    }

    let match = await bcrypt.compare(password, user.password)
    if (!match) {
      req.flash('fail', 'Provide your valid password')
      return res.render('../views/pages/auth/login.ejs', 
      {
        title: 'Login to your account', 
        error: {},
        flashMessage: flash.getMessage(req)
      })
    }
    req.session.isloggedIn = true
    req.session.user = user
    req.session.save(error => {
      if(error) {
        return next(error)
      }
      req.flash('success', 'Successfully logged in')

      res.redirect('/dashboard')
    })
  } catch (error) {
    next(error)
  }
}

exports.logoutController = (req,res,next) => {
  req.session.destroy(error => {
    if(error) {
      return next(error)
    }
    return res.redirect('/auth/login')
  })
}

exports.changePasswordGetController = async (req, res, next) => {
  res.render('pages/auth/changepassword', {
    title: 'Change password',
    flashMessage: flash.getMessage(req)
  })
}

exports.changePasswordPostController = async (req, res, next) => {
  let {oldpassword, newpassword, confirmpassword} = req.body

  if(newpassword !== confirmpassword) {
    req.flash('fail','Password doesnot match')
    return res.redirect('/auth/changepassword')
  }

  try {
    
    let match = await bcrypt.compare(oldpassword, req.user.password)
    if(!match) {
      req.flash('fail','Old password is wrong')
      return res.redirect('/auth/changepassword')
    }
  
    let hashedPassword = await bcrypt.hash(newpassword, 11)

    await User.findOneAndUpdate(
      {_id: req.user._id},
      {$set: {password: hashedPassword}}
    )
    req.flash('success', 'Password Changes succesfully')
    return res.redirect('/auth/changepassword')

  } catch (error) {
    next(error)
  }

}
