const Post = require('../../models/Post');

exports.blogPostLikesGetController = async (req, res, next) => {
  let {postId} = req.params
  let liked = null;

  if(!req.user) {
    res.status(403).json({
      error: 'you are not an authenticated user'
    })
  }

  let userId = req.user._id
  try {
    
    let post = await Post.findById(postId);

    if(post.dislikes.includes(userId)) {
      await Post.findOneAndUpdate(
        {_id: postId},
        {$pull: {'dislikes': userId}}
      )
    }

    if(post.likes.includes(userId)) {
      await Post.findOneAndUpdate(
        {_id: postId},
        {$pull: {'likes': userId}}
      )
      liked = false
    } else{
      await Post.findOneAndUpdate(
        {_id: postId},
        {$push: {'likes': userId}}
      )
      liked = true
    }

    let updatedPost = await Post.findById(postId);

    res.status(200).json({
      liked,
      totalLikes: updatedPost.likes.length,
      totalDisLikes: updatedPost.dislikes.length
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'server error occured'
    })
  }
}

exports.blogPostDisLikesGetController = async (req, res, next) => {
  let {postId} = req.params
  let disliked = null;

  if(!req.user) {
    res.status(403).json({
      error: 'you are not an authenticated user'
    })
  }
  
  let userId = req.user._id
  try {
    let post = await Post.findById(postId);

    if(post.likes.includes(userId)) {
      await Post.findOneAndUpdate(
        {_id: postId},
        {$pull: {'likes': userId}}
      )
    }
    
    if(post.dislikes.includes(userId)) {
      await Post.findOneAndUpdate(
        {_id: postId},
        {$pull: {'dislikes': userId}}
      )
      disliked = false
    } else{
      await Post.findOneAndUpdate(
        {_id: postId},
        {$push: {'dislikes': userId}}
      )
      disliked = true
    }

    let updatedPost = await Post.findById(postId);

    res.status(200).json({
      disliked,
      totalLikes: updatedPost.likes.length,
      totalDisLikes: updatedPost.dislikes.length
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'server error occured'
    })
  }
}
