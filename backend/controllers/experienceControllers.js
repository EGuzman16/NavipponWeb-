import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";
import Experience from "../models/Experience.js";
import Review from "../models/Review.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";

const createExperience = async (req, res, next) => {
    try {
        const { title, caption, body, photo, categories, generalTags, hotelTags, attractionTags, restaurantTags, region, prefecture, price, phone, email, website, schedule, map, address } = req.body;
        const experience = new Experience({
            title: title || "sample title",
            caption: caption || "sample caption",
            slug: uuidv4(),
            body: body || { type: "doc", content: [] },
            photo: photo || "",
            user: req.user._id,
            approved: false,
            categories: categories || "Hoteles",
            generalTags: generalTags || {},
            hotelTags: hotelTags || {},
            attractionTags: attractionTags || [],
            restaurantTags: restaurantTags || {},
            region: region || "Hokkaido",
            prefecture: prefecture || "Hokkaido",
            price: price !== undefined ? price : 0,
            phone: phone || "",
            email: email || "",
            website: website || "",
            schedule: schedule || "",
            map: map || "",
            address: address || "",
            favoritesCount: 0,
        });

        const createdExperience = await experience.save();
        return res.json(createdExperience);
    } catch (error) {
        next(error);
    }
};

const updateExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findOne({ slug: req.params.slug });

        if (!experience) {
            const error = new Error("Experiencia no encontrada");
            next(error);
            return;
        }

        const upload = uploadPicture.single("experiencePicture");

        const handleUpdateExperienceData = async (data) => {
            const { title, caption, slug, body, generalTags, hotelTags, attractionTags, restaurantTags, categories, approved, region, prefecture, price, phone, email, website, schedule, map, address } = JSON.parse(data);
            experience.title = title || experience.title;
            experience.caption = caption || experience.caption;
            experience.slug = slug || experience.slug;
            experience.body = body || experience.body;
            experience.generalTags = generalTags || experience.generalTags;
            experience.hotelTags = hotelTags || experience.hotelTags;
            experience.attractionTags = attractionTags || experience.attractionTags;
            experience.restaurantTags = restaurantTags || experience.restaurantTags;
            experience.categories = categories || experience.categories;
            experience.approved = approved !== undefined ? approved : experience.approved;
            experience.region = region || experience.region;
            experience.prefecture = prefecture || experience.prefecture;
            experience.price = price !== undefined ? price : experience.price;
            experience.phone = phone || experience.phone;
            experience.email = email || experience.email;
            experience.website = website || experience.website;
            experience.schedule = schedule || experience.schedule;
            experience.map = map || experience.map;
            experience.address = address || experience.address;
            const updatedExperience = await experience.save();
            return res.json(updatedExperience);
        };;

        upload(req, res, async function (err) {
            if (err) {
                const error = new Error(
                    "Se produjo un error desconocido al cargar " + err.message
                );
                next(error);
            } else {
                if (req.file) {
                    let filename;
                    filename = experience.photo;
                    if (filename) {
                        fileRemover(filename);
                    }
                    experience.photo = req.file.filename;
                    handleUpdateExperienceData(req.body.document);
                } else {
                    let filename;
                    filename = experience.photo;
                    experience.photo = "";
                    fileRemover(filename);
                    handleUpdateExperienceData(req.body.document);
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const deleteExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findOneAndDelete({ slug: req.params.slug });

        if (!experience) {
            const error = new Error("Experiencia no encontrada");
            return next(error);
        }

        fileRemover(experience.photo);

        await Review.deleteMany({ experience: experience._id });

        return res.json({
            message: "Experiencia eliminada con éxito",
        });
    } catch (error) {
        next(error);
    }
};

const getExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findOne({ slug: req.params.slug }).populate([
            {
                path: "user",
                select: ["avatar", "name"],
            },
            {
                path: "reviews",
                match: {
                    check: true,
                    parent: null,
                },
                populate: [
                    {
                        path: "user",
                        select: ["avatar", "name"],
                    },
                    {
                        path: "replies",
                        match: {
                            check: true,
                        },
                        populate: [
                            {
                                path: "user",
                                select: ["avatar", "name"],
                            },
                        ],
                    },
                ],
            },
        ]);

        if (!experience) {
            const error = new Error("Experiencia no encontrada");
            return next(error);
        }

        return res.json(experience);
    } catch (error) {
        next(error);
    }
};

const getAllExperiences = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if (filter) {
            where.title = { $regex: filter, $options: "i" };
        }
        let query = Experience.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Experience.find(where).countDocuments();
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
            ])
            .sort({ updatedAt: "desc" });

        return res.json(result);
    } catch (error) {
        next(error);
    }
};

const getExperienceById = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ error: 'Experiencia no encontrada' });
        }
        res.json(experience);
    } catch (error) {
        res.status(400).json({ error: 'ID inválido o solicitud mal formada' });
    }
};

const getRelatedExperiences = async (req, res, next) => {
    try {
      const { category } = req.params;
      console.log("Backend category:", category); // Verificar la categoría en el backend
      const experiences = await Experience.find({ categories: category }).limit(4);
      console.log("Related experiences:", experiences); // Verificar las experiencias relacionadas en el backend
      return res.json(experiences);
    } catch (error) {
      next(error);
    }
  };

export { createExperience, updateExperience, deleteExperience, getExperience, getAllExperiences, getExperienceById, getRelatedExperiences, };