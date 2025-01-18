import Experience from "../models/Experience.js";
import Favorite from "../models/Favorite.js";

export const addFavorite = async (req, res) => {
    try {
        const { experienceId } = req.body;
        const userId = req.user.id;
        console.log("Datos recibidos en addFavorite:", { userId, experienceId });


        const existingFavorite = await Favorite.findOne({ userId, experienceId });
        if (existingFavorite) {
            return res.status(400).json({ error: 'La experiencia ya está en tus favoritos' });
        }

        const favorite = new Favorite({ userId, experienceId });
        await favorite.save();


        const favoritesCount = await Favorite.countDocuments({ experienceId });

        res.status(201).json({ favorite, favoritesCount });
    } catch (error) {
        console.error("Error en addFavorite:", error);
        res.status(500).json({ error: 'Error al agregar a favoritos' });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { experienceId } = req.body;
        const userId = req.user.id;
        console.log("Datos recibidos en removeFavorite:", { userId, experienceId });

        const result = await Favorite.findOneAndDelete({ userId, experienceId });
        if (!result) {
            return res.status(404).json({ error: 'Favorito no encontrado' });
        }

        const favoritesCount = await Favorite.countDocuments({ experienceId });

        res.status(200).json({ message: 'Eliminado de favoritos', favoritesCount });
    } catch (error) {
        console.error("Error en removeFavorite:", error);
        res.status(500).json({ error: 'Error al eliminar de favoritos' });
    }
};

export const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Datos recibidos en getUserFavorites:", { userId });
        const favorites = await Favorite.find({ userId }).populate('experienceId');
        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error en getUserFavorites:", error);
        res.status(500).json({ error: 'Error al obtener los favoritos' });
    }
};

export const getFavoritesCount = async (req, res) => {
    try {
        const { experienceId } = req.params;
        const favoritesCount = await Favorite.countDocuments({ experienceId });
        res.status(200).json({ favoritesCount });
    } catch (error) {
        console.error("Error en getFavoritesCount:", error);
        res.status(500).json({ error: 'Error al obtener el contador de favoritos' });
    }
};
