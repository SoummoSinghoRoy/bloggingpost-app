const Profile = require('../../models/Profile')

exports.blogPostBookmarksGetController = async (req, res, next) => {
  let {postId} = req.params

  if(!req.user) {
    res.status(403).json({
      error: 'you are not an authenticated user'
    })
  }
  let userId = req.user._id
  let bookmark = null;

  try {
    let profile = await Profile.findOne({user: userId})

    if(profile.bookmarks.includes(postId)) {
      await Profile.findOneAndUpdate(
        {user: userId},
        {$pull: {'bookmarks': postId}}
      )
      bookmark = false
    } else{
      await Profile.findOneAndUpdate(
        {user: userId},
        {$push: {'bookmarks': postId}}
      )
      bookmark = true
    }
    res.status(200).json({
      bookmark
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'server error occured'
    })
  }
}
