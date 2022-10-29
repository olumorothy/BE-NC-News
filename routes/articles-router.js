const {
  getAllArticles,
  getArticlesById,
  patchArticleById,
} = require("../controllers/articlesController");
const {
  getCommentsByArticleId,
  addCommentByArticleId,
} = require("../controllers/commentsControllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(addCommentByArticleId);

module.exports = articlesRouter;
