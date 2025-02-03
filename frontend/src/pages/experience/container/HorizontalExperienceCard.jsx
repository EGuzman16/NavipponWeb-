import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTheme , Typography
} from "@mui/material";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  getFavoritesCount as getFavoritesCountService,
  getUserFavorites,
} from "../../../services/index/favorites";
import { images, stables } from "../../../constants";
import "../../../css/Items/ItemsPage.css";

const HorizontalExperienceCard = ({
  experience,
  user,
  token,
  className,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const { palette } = useTheme();
  useEffect(() => {
    const fetchFavoritesCount = async () => {
      try {
        const response = await getFavoritesCountService(experience._id);
        setFavoritesCount(response.favoritesCount);
      } catch (error) {
        console.error("Error fetching favorites count:", error);
      }
    };

    fetchFavoritesCount();
  }, [experience._id]);

  useEffect(() => {
    if (!user || !token || !user._id) {
      console.warn("User or token is missing. Skipping favorites check.");
      return;
    }

    const fetchFavorites = async () => {
      try {
        console.log("Fetching favorites for user:", user._id);
        const favorites = await getUserFavorites({ userId: user._id, token });
        console.log("Favorites fetched:", favorites);

        const isFav = favorites.some(
          (fav) => fav.experienceId && fav.experienceId._id === experience._id
        );
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    };

    fetchFavorites();
  }, [user, token, experience._id]);

  const handleFavoriteClick = async () => {
    if (!user || !token || !user._id) {
      toast.error("Debes iniciar sesión para agregar a favoritos");
      return;
    }

    try {
      if (isFavorite) {
        console.log("Removing from favorites:", experience._id);
        const response = await removeFavoriteService({
          userId: user._id,
          experienceId: experience._id,
          token,
        });
        setIsFavorite(false);
        setFavoritesCount(response.favoritesCount);
        toast.success("Se eliminó de favoritos");
      } else {
        console.log("Adding to favorites:", experience._id);
        const response = await addFavoriteService({
          userId: user._id,
          experienceId: experience._id,
          token,
        });
        setIsFavorite(true);
        setFavoritesCount(response.favoritesCount);
        toast.success("Se agregó a favoritos");
      }
      onFavoriteToggle();
    } catch (error) {
      console.error("Error updating favorites:", error);
      if (error.response && error.response.status === 400) {
        toast.error("La experiencia ya está en tus favoritos");
      } else {
        toast.error("Error al actualizar favoritos");
      }
    }
  };

  const borderColor = "#96C6D9";
  const titleColor = "#FF4A5A";
  const buttonColor = "#96C6D9";
  const likeColor = "#FF4A5A";

  return (
    <div
    className={`activity-item ${className}`}
    style={{
      width: "100%", // Ensures full width of the parent container
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      border: `2px solid ${borderColor}`,
      borderRadius: "10px",
      overflow: "hidden",
    }}
  >
    {/* Image Section */}
    <div style={{ flex: "0 0 229px" }}> 
      <img
        src={
          experience.photo
            ? `${stables.UPLOAD_FOLDER_BASE_URL}${experience.photo}`
            : images.sampleExperienceImage
        }
        alt={experience.title}
        className="object-cover w-full h-full rounded-lg"
        style={{ maxWidth: "229px", height: "auto", objectFit: "cover" }} 
      />
    </div>
  
    {/* Content Section */}
    <div className="activity-details" style={{ flexGrow: 1, padding: "20px" }}>
      <Typography variant="h6" style={{ color: titleColor }}>
        {experience.title}
        <span className="prefecture-badge">{experience.prefecture || "No hay prefectura"}</span>
      </Typography>
  
      <Typography style={{ color: palette.secondary.main, marginBottom: "10px" }}>
        {experience.tags && experience.tags.length > 0
          ? experience.tags.join(" | ")
          : "Sin categorías"}
      </Typography>
  
      <p className="activity-description">{experience.caption}</p>
  
      <div className="wrap-buttons">
        <Link
          to={`/experience/${experience.slug}`}
          className="button-detail"
          style={{
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            backgroundColor: palette.secondary.main,
            color: "white",
            display: "inline-block",
            marginTop: "10px",
          }}
        >
          Ver más
        </Link>
      </div>
    </div>
  
    {/* Favorite & Price Section */}
    <div className="budget">
      <div
        className="favorite cursor-pointer"
        onClick={handleFavoriteClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "37px",
          borderRadius: "50%",
          backgroundColor: likeColor,
          border: `2px solid ${likeColor}`,
        }}
      >
        {isFavorite ? (
          <AiFillHeart color="white" size={24} />
        ) : (
          <AiOutlineHeart color="white" size={24} />
        )}
      </div>
  
      <Typography variant="h6" className="activity-price">
        {experience.price ? `${experience.price} €` : "No disponible"}
      </Typography>
    </div>
  </div>
  
  );
};

export default HorizontalExperienceCard;
