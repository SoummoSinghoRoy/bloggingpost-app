const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

exports.createCommentPostController = async (req, res, next) => {
  let {postId} = req.params;
  let {body} = req.body;

  if(!req.user) {
    res.status(403).json({
      error: 'you are not an authenticated user'
    })
  }
  let comment = new Comment({
    post: postId,
    user: req.user._id,
    body,
    replies: []
  })

  try {
    let createdComment = await comment.save()
    await Post.findOneAndUpdate(
      {_id: postId},
      {$push: {'comments': createdComment._id}}
    )

    let commentJSON = await Comment.findById(createdComment._id).populate({
      path: 'user',
      select: 'profilePics username'
    })
    return res.status(201).json(commentJSON)

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'server error occured'
    })
  }
}

exports.replyCommentPostController = async (req, res, next) => {
  let {commentId} = req.params;
  let {body} = req.body;

  if(!req.user) {
    res.status(403).json({
      error: 'you are not an authenticated user'
    })
  }

  let reply = {
    body,
    user: req.user._id
  }
  try {
    await Comment.findOneAndUpdate(
      {_id: commentId},
      {$push: {'replies': reply}}
    )
    res.status(201).json({
      ...reply,
      profilePics: req.user.profilePics
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'server error occured'
    })
  }
}
