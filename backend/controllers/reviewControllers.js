import Review from "../models/Review.js";
import Experience from "../models/Experience.js";

const createReview = async (req, res, next) => {
    try {
        const { desc, slug, parent, replyOnUser } = req.body;

        const experience = await Experience.findOne({ slug: slug });

        if (!experience) {
            const error = new Error("Experiencia no encontrada");
            return next(error);
        }

        const newReview = new Review({
            user: req.user._id,
            desc,
            experience: experience._id,
            parent,
            replyOnUser,
        });

        const savedReview = await newReview.save();
        return res.json(savedReview);
    } catch (error) {
        next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const { desc, check } = req.body;

        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            const error = new Error("Comentario no encontrado");
            return next(error);
        }

        review.desc = desc || review.desc;
        review.check = typeof check !== "undefined" ? check : review.check;

        const updatedReview = await review.save();
        return res.json(updatedReview);
    } catch (error) {
        next(error);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.reviewId);

        if (!review) {
            const error = new Error("Comentario no encontrado");
            return next(error);
        }

        await Review.deleteMany({ parent: review._id });

        return res.json({
            message: "El comentario ha sido eliminado",
        });
    } catch (error) {
        next(error);
    }
};

const getAllReviews = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if (filter) {
            where.desc = { $regex: filter, $options: "i" };
        }
        let query = Review.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Review.find(where).countDocuments();
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
                    path: "experience",
                    select: ["slug", "title"],
                },
            ])
            .sort({ updatedAt: "desc" });

        return res.json(result);
    } catch (error) {
        next(error);
    }
};

export { createReview, updateReview, deleteReview, getAllReviews };