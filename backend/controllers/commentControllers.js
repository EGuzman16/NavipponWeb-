import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const createComment = async (req, res, next) => {
  try {
    const { desc, slug, parent, replyOnUser } = req.body;

    const post = await Post.findOne({ slug: slug });

    if (!post) {
      const error = new Error("Post no encontrado");
      return next(error);
    }

    const newComment = new Comment({
      user: req.user._id,
      desc,
      post: post._id,
      parent,
      replyOnUser,
    });

    const savedComment = await newComment.save();
    return res.json(savedComment);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { desc, check } = req.body;

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      const error = new Error("Comentario no encontrado");
      return next(error);
    }

    comment.desc = desc || comment.desc;
    comment.check = typeof check !== "undefined" ? check : comment.check;

    const updatedComment = await comment.save();
    return res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    await Comment.deleteMany({ parent: comment._id });

    if (!comment) {
      const error = new Error("Comentario no encontrado");
      return next(error);
    }

    return res.json({
      message: "El comentario ha sido eliminado",
    });
  } catch (error) {
    next(error);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.desc = { $regex: filter, $options: "i" };
    }
    let query = Comment.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Comment.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
        {
          path: "parent",
          populate: [
            {
              path: "user",
              select: ["avatar", "name"],
            },
          ],
        },
        {
          path: "replyOnUser",
          select: ["avatar", "name"],
        },
        {
          path: "post",
          select: ["slug", "title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const getCommentCount = async (req, res) => {
  try {
    const count = await Comment.countDocuments();
    console.log("Count of comments:", count);  
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error en getCommentCount:", error);
    res.status(500).json({ error: 'Error al obtener el contador de comentarios' });
  }
};

export { createComment, updateComment, deleteComment, getAllComments, getCommentCount };
