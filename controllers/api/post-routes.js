const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");


router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["username"] },
        { model: Comment, include: [{ model: User, attributes: ["username"] }] },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with that id" });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/:id", withAuth, async (req, res) => {
  try {
    const [updatedRowsCount] = await Post.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRowsCount === 0) {
      res.status(404).json({ message: "No post found with that id" });
      return;
    }
    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    await Comment.destroy({
      where: { post_id: req.params.id },
    });

    const deletedRowsCount = await Post.destroy({
      where: { id: req.params.id },
    });

    if (deletedRowsCount === 0) {
      res.status(404).json({ message: "No post found with that id" });
      return;
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
