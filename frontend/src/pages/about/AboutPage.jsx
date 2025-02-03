import { Box } from "@mui/material";
import Header from "./content/Header.jsx";
import AboutSection from "./content/AboutSection.jsx";
import PrinciplesSection from "./content/PrinciplesSection.jsx";
import CommunitySection from "./content/CommunitySection.jsx";
import WhyJapanSection from "./content/WhyJapanSection.jsx";
import BgShape from "../../components/Shapes/BgShape.jsx";
import MainLayout from "../../components/MainLayout";
const AboutPage = () => {
  return (
    <MainLayout id="body">
      <Header />
      <BgShape />
      <AboutSection />
      <WhyJapanSection />
      <PrinciplesSection />
      <CommunitySection />
    </MainLayout>
  );
};

export default AboutPage;
