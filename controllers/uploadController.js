const Profile = require('../models/Profile');
const User = require('../models/User');
const flash = require('../utils/Flash');

exports.uploadProfilePicGetController = async (req, res, next) => {
  try {
    let defaultPics = "/uploads/default.png"
    let existUser = await User.findOne({_id: req.user._id})

    if(existUser.profilePics == defaultPics) {
      res.render('../views/pages/dashboard/upload-pic.ejs', {
        title: 'Upload your profile pic',
        flashMessage: flash.getMessage(req) 
      })
    } else{
      res.redirect('/dashboard/create-profile')
    }
  } catch (error) {
    next(error)
  }   
}

exports.uploadProfilePicPostController = async (req, res, next) => {
  if (req.file) {
    try {
      let profile = await Profile.findOne({user: req.user._id})
      let profilePics = `/uploads/${req.file.filename}`
      if(profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: {profilePics} }
        )
      }
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: {profilePics} }
      )
      return res.redirect('/dashboard/create-profile')
    } catch (error) {
      res.status(500).json({
        profilePics: req.user.profilePics
      })
    }
  } else {
    res.render('../views/pages/dashboard/upload-pic.ejs', { 
      title: 'Upload your profile pic',
      flashMessage: flash.getMessage(req) 
    })
  }
}

exports.postImageUploadController = (req, res, next) => {
  
  if(req.file) {
    return res.status(200).json({
      imgUrl: `/uploads/${req.file.filename}`
    })
  }
  return res.status(500).json({
    message: 'server error'
  })
}