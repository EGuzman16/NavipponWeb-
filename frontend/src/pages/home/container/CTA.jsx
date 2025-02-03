import { useTheme } from "@mui/material";
import "../../../css/Universal.css";
import { Link } from "react-router-dom";

const CTA = () => {
  const theme = useTheme();

  return (
    <div
      className="p-0 m-0 mb-3 mt-3"
      style={{
        padding: "2rem 0rem 2rem 0rem",
        backgroundColor: theme.palette.secondary.bg,
      }}
    >
      <div className="w-full flex flex-col md:flex-row items-center p-0 m-0">
        {/* Image Section */}
        <div
          className="md:w-1/2 mb-0 md:mb-0 md:ml-0 flex-shrink-0 p-0 m-0"
          style={{
            overflow: "hidden",
          }} // Apply border radius to the container
        >
          <img
            src="/assets/home.jpg"
            alt="templo de kyoto"
            className="w-full h-full object-cover m-0"
            style={{ borderRadius: "0rem 200rem 200rem 0rem" }} // Apply border radius directly to the image
          />
        </div>

        {/* Text Section */}
        <div
          className="md:w-1/2 text-black p-8"
          style={{ color: theme.palette.neutral.dark }}
        >
          <h2 className="text-3xl mb-4">
            Haz de tu viaje un gran éxito con Navippon
          </h2>
          <p className="mb-6">
            Con Navippon, cada paso de tu viaje se transforma en una experiencia
            inolvidable. Personaliza tu aventura, descubre lugares únicos y crea
            recuerdos que durarán toda la vida. Deja que Navippon sea tu guía
            confiable en el viaje de tus sueños.
          </p>
          <Link to="/experience" style={{ textDecoration: "none" }}>
            <button
              type="submit"
              className="rounded-full px-6 py-3 w-full md:w-auto"
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.white,
              }}
            >
              Explorar destinos
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
