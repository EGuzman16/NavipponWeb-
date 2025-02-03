import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-hot-toast";
import {
 
  useTheme,
} from "@mui/material";
import BreadcrumbBack from "../../components/BreadcrumbBack";
import ReviewsContainer from "../../components/reviews/ReviewsContainer";
import MainLayout from "../../components/MainLayout";
import SocialShareButtons from "../../components/SocialShareButtons";
import { images, stables } from "../../constants";
import BgShape from "../../components/Shapes/BgShape.jsx";
import { useQuery } from "@tanstack/react-query";
import { getAllExperiences, getSingleExperience } from "../../services/index/experiences";
import ExperienceDetailSkeleton from "./components/ExperienceDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import parseJsonToHtml from "../../utils/parseJsonToHtml";
import Editor from "../../components/editor/Editor";
import useUser from "../../hooks/useUser";
import { addFavorite as addFavoriteService, removeFavorite as removeFavoriteService, getUserFavorites } from "../../services/index/favorites";
import Aside from "./container/Aside";  
import Hero from "./container/Hero";  
import { Tabs, Tab } from "./container/Tabs"; 
import CarouselExperiences from "./container/CarouselExperiences"; 
import SuggestedExperiences from "./container/SuggestedExperiences";


const ExperienceDetailPage = () => {
  const { slug } = useParams();
  const { user, jwt } = useUser();

  const { palette } = useTheme();
  const [breadCrumbsData, setbreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleExperience({ slug }),
    queryKey: ["experience", slug],
    onSuccess: async (data) => {
      setbreadCrumbsData([
        { name: "Home", link: "/" },
        { name: "Experience", link: "/experience" },
        { name: "Detalle", link: `/experience/${data.slug}` },
      ]);
      setBody(parseJsonToHtml(data?.body));
      if (user && jwt) {
        const favorites = await getUserFavorites({ userId: user._id, token: jwt });
        const isFav = favorites.some(fav => fav.experienceId && fav.experienceId._id === data._id);
        setIsFavorite(isFav);
      }
    },
  });

  const { data: ExperiencesData } = useQuery({
    queryFn: () => getAllExperiences(),
    queryKey: ["experiences"],
  });

  useEffect(() => {
    if (data && user && jwt) {
      getUserFavorites({ userId: user._id, token: jwt })
        .then(favorites => {
          const isFav = favorites.some(fav => fav.experienceId && fav.experienceId._id === data._id);
          setIsFavorite(isFav);
        })
        .catch(error => console.error("Error fetching user favorites:", error));
    }
  }, [user, jwt, data]);

  const handleFavoriteClick = async () => {
    if (!user || !jwt) {
      toast.error("Debes iniciar sesión para agregar a favoritos");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteService({ userId: user._id, experienceId: data._id, token: jwt });
        setIsFavorite(false);
        toast.success("Se eliminó de favoritos");
      } else {
        await addFavoriteService({ userId: user._id, experienceId: data._id, token: jwt });
        setIsFavorite(true);
        toast.success("Se agregó a favoritos");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
    }
  };

  //console.log("ExperienceDetailPage data:", data); 

  return (
    <MainLayout>
      {isLoading ? (
        <ExperienceDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
      ) : (
        <>
          <Hero 
            imageUrl={data?.photo ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo : images.sampleExperienceImage} 
            imageAlt={data?.title} 
          />  <BgShape></BgShape>
          <section className="container mx-auto px-5 ">
            <BreadcrumbBack />
          
            <div className="mt-4 flex gap-2">
              {Array.isArray(data?.categories) && data.categories.map((category) => (
                <Link
                  key={category}
                  to={`/experience?category=${category}`}
                  className="text-primary text-sm inline-block md:text-base"
                >
                  {category}
                </Link>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <h2 className="font-medium text-dark-hard 
              
      " style={{fontSize: "2.5rem"}}>
                {data?.title}
              </h2> 
              <button
                onClick={handleFavoriteClick}
                style={{height: "60px", width: "60px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: palette.primary.main }}
                className=" p-2 rounded-full focus:outline-none"
              >
                {isFavorite ? (
                  <AiFillHeart className="text-white text-3xl" />
                ) : (
                  <AiOutlineHeart className="text-white text-3xl" /> 
                )}
              </button>
            </div>
            <p className="text-lg font-medium mt-2 text-dark-hard">
              {data?.region} ({data?.prefecture})
            </p>
            <p className="text-lg font-medium mt-2 text-dark-hard">
              Precio: {data?.price ? `${data.price} €` : "No disponible"}
            </p>
            <Tabs>
              <Tab label="Descripción">
                <div className="flex flex-col lg:flex-row lg:gap-x-5">
                  <Aside info={data} />
                  <div className="flex-1">
                    <div className="w-full mt-4">
                      <Editor content={data.body} editable={false} />
                    </div>
                    <CarouselExperiences header="Navega Experiencias" experiences={ExperiencesData?.data} />  
                  </div>
                </div>
              </Tab>
              <Tab label="Reseñas">
                <div className="flex flex-col lg:flex-row lg:gap-x-5">
                  <div className="flex-1">
                    <ReviewsContainer
                      reviews={data?.reviews}
                      className="mt-10"
                      logginedUserId={user?._id}
                      experienceSlug={slug}
                      jwt={jwt}  
                    />
                  </div>
                  <div>
                    <SuggestedExperiences
                      header="Últimas experiencias"
                      experiences={ExperiencesData?.data}
                      className="mt-8 lg:mt-0 lg:max-w-xs"
                    />
                    <div className="mt-7">
                      <h2 className="font-medium text-dark-hard mb-4 md:text-xl">
                        Compartir con:
                      </h2>
                      <SocialShareButtons
                        url={encodeURI(window.location.href)}
                        title={encodeURIComponent(data?.title)}
                      />
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </section>
        </>
      )}
    </MainLayout>
  );
};

export default ExperienceDetailPage;