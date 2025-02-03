import { useTheme } from "@mui/material/styles";

const CommunitySection = () => {
  const theme = useTheme();
  const lightBlue = theme.palette.secondary.light;

  return (
    <div
      style={{
        backgroundColor: lightBlue,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "row",
        fontSize: "1rem",
        height: "45vh",
        alignItems: "center",
        marginBottom: "2rem",
      }}
    >
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src="/assets/community.jpg"
          alt="Nuestra Comunidad"
          style={{
            width: "95%",
            height: "auto",
            maxWidth: "100%",
            borderRadius: "0rem 20rem 20rem 0rem",
          }}
        />
      </div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <h2
          style={{
            marginBottom: "1rem",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          Nuestra Comunidad
        </h2>
        <p style={{ width: "80%" }}>
          Nuestra comunidad es fundamental para nosotros. Estamos deseando verla
          <span style={{ fontWeight: "bold" }}> crecer y florecer </span>con
          nuevos miembros apasionados por{" "}
          <span style={{ fontWeight: "bold" }}>Japón</span>. Que se animen a
          discusiones, compartir aventuras y conectar con amantes de la cultura
          japonesa de <span style={{ fontWeight: "bold" }}>todo el mundo.</span>
        </p>
      </div>
    </div>
  );
};

export default CommunitySection;
