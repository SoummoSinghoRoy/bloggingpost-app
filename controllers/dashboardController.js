const { validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({user: req.user._id})
                               .populate({
                                path: 'posts',
                                select: 'title thumbnail'
                               })
                               .populate({
                                path: 'bookmarks',
                                select: 'title thumbnail'
                               })

    let posts = await Post.find({author: req.user._id})
    
    if(profile) {
      return res.render('../views/pages/dashboard/dashboard.ejs', 
      {
        title: `My Dashboard`,
        flashMessage: flash.getMessage(req),
        posts: profile.posts.slice(0,6),
        bookmarks: profile.bookmarks.slice(0,3),
        totalpostlength: profile.posts.length,
        totalbookmarkslength: profile.bookmarks.length,
        lastPost: posts[posts.length - 1]
      })
    }
    res.redirect('/uploads/profile-pics')
  } catch (error) {
    next(error)
  }
}

exports.createProfileGetController = async (req, res, next) => {
  try {
    let defaultPics = "/uploads/default.png"
    let user = await User.findOne({_id: req.user._id })

    if(user.profilePics === defaultPics) {
      return res.redirect('/uploads/profile-pics')
    }

    let profile = await Profile.findOne({user: req.user._id})

    if(profile) {
      return res.redirect('/dashboard')
    }
    res.render('pages/dashboard/create-profile.ejs', 
      {
        title: `Create a profile`,
        flashMessage: flash.getMessage(req),
        error: {} 
      })

  } catch (error) {
    next(error)
  }
}

exports.createProfilePostController = async (req, res, next) => {

  let errors = validationResult(req).formatWith(errorFormatter)
  
  if(!errors.isEmpty()) {

    return res.render('../views/pages/dashboard/create-profile', { 
      title: 'Create a profile', 
      error: errors.mapped(), 
      flashMessage: flash.getMessage(req)
    })
    
  }

  let { name, title, bio, website, facebook, twitter, userGithub  } = req.body

  try {

    let existUser = await User.findOne({user: req.user._id})

    if(existUser) {
      let profile = new Profile({
        user:  req.user._id,
        name,
        title,
        bio,
        profilePics: req.user.profilePics,
        links: {
          website: website || '',
          facebook: facebook || '',
          twitter: twitter || '',
          userGithub: userGithub || ''
        },
        posts: [],
        bookmarks: []
      })

      let createdProfile = await profile.save()
      await User.findOneAndUpdate(
        { _id: req.user._id },
        {$set: { profile: createdProfile._id } }
      )
      req.flash('success', 'profile created successfully')
      res.redirect('/dashboard')
    }
    
    res.render('../views/pages/dashboard/create-profile', { 
      title: 'Create a profile', 
      flashMessage: flash.getMessage(req),
      error: {}
    })
    
  } catch (error) {
    next(error)
  }
}

exports.editProfileGetController = async (req, res, next) => {
  try {

    let profile = await Profile.findOne({user: req.user._id})

    if(!profile) {
      return res.redirect('/dashboard/create-profile')
    }

    res.render('../views/pages/dashboard/edit-profile.ejs', {
      title: 'Edit your profile', 
      profile,
      flashMessage: flash.getMessage(req),
      error: {} 
    })

  } catch (error) {
    next(error)
  }
}

exports.editProfilePostController = async (req, res, next) => {

  let { name, title, bio, website, facebook, twitter, userGithub  } = req.body

  let errors = validationResult(req).formatWith(errorFormatter)


  if(!errors.isEmpty()) {

    return res.render('../views/pages/dashboard/edit-profile', { 
      title: 'Edit your profile', 
      error: errors.mapped(), 
      flashMessage: flash.getMessage(req),
      profile: {
        name, title, bio, 
        links: {
          website,
          facebook,
          twitter,
          userGithub
        },
      }
    })
  }

  try {
    
    let profile = {
      name,
      title,
      bio,
      links: {
        website: website || '',
        facebook: facebook || '',
        twitter: twitter || '',
        userGithub: userGithub || ''
      }
    }

    let updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profile },
      { new: true }
    )

    req.flash('success', 'profile updated successfully')
    res.render('../views/pages/dashboard/edit-profile.ejs', {
      title: 'Edit your profile', 
      flashMessage: flash.getMessage(req),
      error: {},
      profile: updatedProfile 
    })

  } catch (error) {
    next(error)
  }
}

exports.bookmarksPostGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({user: req.user._id})
                                    .populate({
                                      path: 'bookmarks',
                                      model: 'Post',
                                      select: 'title thumbnail'
                                    })
    
    res.render('pages/dashboard/bookmarks', {
      title: 'Bookmarks post',
      flashMessage: flash.getMessage(req),
      bookmarksPost: profile.bookmarks
    })

  } catch (error) {
    next(error)
  }
}

exports.postCommentsGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({user: req.user._id})
    let comments = await Comment.find({post: {$in: profile.posts}})
                                .populate({
                                  path: 'post',
                                  select: 'title'
                                })
                                .populate({
                                  path: 'user',
                                  select: 'username profilePics'
                                })
                                .populate({
                                  path: 'replies.user',
                                  select: 'username profilePics'
                                })

    res.render('pages/dashboard/comments', {
      title: 'Recent comments',
      flashMessage: flash.getMessage(req),
      comments
    })
  } catch (error) {
    next(error)
  }
}

