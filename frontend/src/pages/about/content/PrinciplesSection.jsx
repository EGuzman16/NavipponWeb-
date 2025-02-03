import { useTheme } from "@mui/material/styles";
import "../../../css/AboutUs.css";
import CustomShape from "../../../components/Shapes/CustomShape";

const PrinciplesSection = () => {
  const theme = useTheme();
  const primaryMain = theme.palette.primary.main; // Retrieve primary main color

  return (
    <div
      className="principle-card-container"
      style={{
        display: "flex",
        padding: "56px",
        fontSize: "1rem",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        margin: "auto",
        marginTop: "2rem",
        marginBottom: "2rem",
      }}
    >
      <div className="mb-20 flex flex-col items-center justify-center">
        <CustomShape />
        <h5
          style={{
            marginRight: "1rem",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginTop: "1rem",
          }}
        >
          Nuestros Principios
        </h5>
        <p>Navippon te ayuda a planificar tu viaje con nuestros ideales.</p>
      </div>
      <div className="principle-card-content">
        {/* Misión Section */}
        <div className="principle-card-section">
          <img
            src="/assets/mission-icon.png"
            alt="Ícono de Misión"
            style={{ width: "50px", height: "50px" }}
          />
          <h6
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            Misión
          </h6>
          <p style={{ marginTop: "1rem", width: "70%", textAlign: "left" }}>
            Nuestra misión en Navippon es ser el{" "}
            <span style={{ color: primaryMain }}>compañero confiable</span> para
            los viajeros que desean explorar la riqueza y belleza de Japón.
            Estamos comprometidos a proporcionar a nuestros usuarios las
            herramientas y la información que necesitan para planificar viajes
            personalizados y significativos.
          </p>
        </div>

        {/* Valores Section */}
        <div className="principle-card-section">
          <img
            src="/assets/values-icon.png"
            alt="Ícono de Valores"
            style={{ width: "50px", height: "50px" }}
          />
          <h6
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            Valores
          </h6>
          <p style={{ marginTop: "1rem", width: "70%", textAlign: "left" }}>
            Amamos Japón en todas sus dimensiones y compartimos esa pasión con
            nuestros usuarios. Nos esforzamos por promover el{" "}
            <span style={{ color: primaryMain }}>entendimiento y respeto</span>{" "}
            por la cultura japonesa en cada experiencia de viaje que ofrecemos.
          </p>
        </div>

        {/* Visión Section */}
        <div className="principle-card-section">
          <img
            src="/assets/vision-icon.png"
            alt="Ícono de Visión"
            style={{ width: "50px", height: "50px" }}
          />
          <h6
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            Visión
          </h6>
          <p style={{ marginTop: "1rem", width: "70%", textAlign: "left" }}>
            Nuestra visión en Navippon es convertirnos en la plataforma líder
            para la exploración y planificación de viajes en Japón. Aspiramos a
            ser reconocidos por nuestra{" "}
            <span style={{ color: primaryMain }}>excelencia</span> en
            proporcionar a los viajeros una experiencia donde puedan descubrir
            la autenticidad de Japón.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrinciplesSection;
