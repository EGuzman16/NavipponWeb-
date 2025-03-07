import Itinerary from "../models/Itinerary.js";
import Favorite from "../models/Favorite.js";
import Experience from "../models/Experience.js";

const createItinerary = async (req, res, next) => {
    try {
        const { name, travelDays, totalBudget, boards, notes } = req.body;
        const itinerary = new Itinerary({
            name,
            travelDays,
            totalBudget,
            boards,
            notes,
            user: req.user._id,
        });

        const createdItinerary = await itinerary.save();
        return res.status(201).json(createdItinerary);
    } catch (error) {
        next(error);
    }
};

const getAllItineraries = async (req, res, next) => {
    try {
        const itineraries = await Itinerary.find().populate('boards.favorites').populate('user');
        return res.status(200).json(itineraries);
    } catch (error) {
        next(error);
    }
};

const getItinerary = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id).populate('user');
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerario no encontrado" });
        }

        const boardsWithFavorites = await Promise.all(
            itinerary.boards.map(async (board) => {
                const favoritesWithDetails = await Promise.all(
                    board.favorites.map(async (favoriteId) => {
                        const favorite = await Favorite.findById(favoriteId).populate('experienceId');
                        if (!favorite || !favorite.experienceId) {
                            console.error(`Invalid Favorite or missing experienceId: ${favoriteId}`);
                            return null; 
                        }

                        return {
                            favoriteId: favorite._id,
                            experience: favorite.experienceId,
                        };
                    })
                );

                return {
                    ...board.toObject(),
                    favorites: favoritesWithDetails.filter(Boolean), 
                };
            })
        );

        return res.status(200).json({ ...itinerary.toObject(), boards: boardsWithFavorites });
    } catch (error) {
        console.error("Error en getItinerary:", error);
        return next(error);
    }
};

const getItineraryForEdit = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)
            .populate({
                path: 'boards.favorites',
                populate: {
                    path: 'experienceId', 
                    model: 'Experience'  
                }
            })
            .populate('user');

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerario no encontrado" });
        }

        return res.status(200).json(itinerary);
    } catch (error) {
        console.error("Error en getItineraryForEdit:", error);
        return next(error);
    }
};

const updateItinerary = async (req, res, next) => {
    try {
        const { name, travelDays, totalBudget, boards, notes } = req.body;
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerario no encontrado" });
        }

        itinerary.name = name || itinerary.name;
        itinerary.travelDays = travelDays || itinerary.travelDays;
        itinerary.totalBudget = totalBudget || itinerary.totalBudget;
        itinerary.boards = boards || itinerary.boards;
        itinerary.notes = notes || itinerary.notes;

        const updatedItinerary = await itinerary.save();

        const boardsWithFavorites = await Promise.all(
            updatedItinerary.boards.map(async (board) => {
                const favoritesWithDetails = await Promise.all(
                    board.favorites.map(async (favoriteId) => {
                        const favorite = await Favorite.findById(favoriteId).populate('experienceId');
                        return favorite || null;
                    })
                );

                return {
                    ...board.toObject(),
                    favorites: favoritesWithDetails.filter(Boolean),
                };
            })
        );

        return res.status(200).json({ ...updatedItinerary.toObject(), boards: boardsWithFavorites });
    } catch (error) {
        console.error("Error en updateItinerary:", error);
        next(error);
    }
};

const deleteItinerary = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerario no encontrado" });
        }
        return res.status(200).json({ message: "Itinerario eliminado con éxito" });
    } catch (error) {
        next(error);
    }
};

const getUserItineraries = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const itineraries = await Itinerary.find({ user: userId }).populate('boards.favorites').populate('user');
        return res.status(200).json(itineraries);
    } catch (error) {
        next(error);
    }
};

export { createItinerary, getAllItineraries, getItinerary, getItineraryForEdit, updateItinerary, deleteItinerary, getUserItineraries };