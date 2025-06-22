const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const commentController = require("../controllers/blog.controller");
// const { authController } = require('../controllers/auth.controller')

router
  .route("/:id")
  .get(blogController.getBlogById)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

router.route("/comments/:blogId").get(commentController.getComment)

router.route("/comments/:commentId")
  .delete(commentController.deleteComment);
router.route("/comments/:commentId")
  .put(commentController.editComment);

router.route("/getBlogByEmail/:email")
  .get(commentController.getBlogByEmail);

router.route("/")
  .get(blogController.getBlog)
  .get(blogController.getBlogSuggestion)
  .post(blogController.addBlog);

router.route("/blog-suggestion/:suggestion").get(blogController.getBlogSuggestion)

router.route("/add-comment").post(commentController.addComment);
router.route("/add-reply").post(commentController.addReply);

// router.route("/comment").post(commentController.addComment);
// router.route("/comment").post(authController.verifyUser, commentController.addComment);


module.exports = router;
