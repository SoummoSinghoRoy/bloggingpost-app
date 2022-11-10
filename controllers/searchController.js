const Post = require("../models/Post");
const Flash = require('../utils/Flash');

exports.searchResultGetController = async (req, res, next) => {

  let searchTerm = req.query.searchTerm
  let currentPage = parseInt(req.query.page) || 1
  let itemPerPage = 10
  
  try {
    let posts = await Post.find(
                    {
                      $text: {
                        $search: searchTerm
                      }
                    }
                  ).skip((itemPerPage * currentPage) - itemPerPage)
                   .limit(itemPerPage)
    
    let totalPosts = await Post.countDocuments({
        $text: {
          $search: searchTerm
        }
      })
    
      let totalPage = totalPosts / itemPerPage

      res.render('../views/pages/explorer/search', {
        title: `Search result - ${searchTerm}`,
        flashMessage: Flash.getMessage(req),
        posts,
        searchTerm,
        itemPerPage,
        currentPage,
        totalPage
      })
     
  } catch (error) {
    next(error)
  }

}
