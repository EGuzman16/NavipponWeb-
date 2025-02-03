import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTextField from "../components/CustomTextField.jsx";
import CustomSelect from "../components/CustomSelect.jsx";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useTheme } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const SearchBarHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Hardcoded data
  const regions = [
    { _id: "1", region: "Region A" },
    { _id: "2", region: "Region B" },
  ];

  const prefectures = [
    { _id: "101", name: "Prefecture X", region: "1" },
    { _id: "102", name: "Prefecture Y", region: "1" },
    { _id: "201", name: "Prefecture Z", region: "2" },
  ];

  const budgets = [
    { _id: "b1", name: "Low Budget" },
    { _id: "b2", name: "Mid Budget" },
    { _id: "b3", name: "High Budget" },
  ];

  const [filteredPrefectures, setFilteredPrefectures] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedPrefectureId, setSelectedPrefectureId] = useState("");
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegionChange = (event) => {
    const regionId = event.target.value;
    setSelectedRegionId(regionId);

    if (!regionId) {
      setFilteredPrefectures([]);
      setSelectedPrefectureId("");
      return;
    }

    setFilteredPrefectures(prefectures.filter((p) => p.region === regionId));
    setSelectedPrefectureId("");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const queryParams = new URLSearchParams({
      region: selectedRegionId || "",
      prefecture: selectedPrefectureId || "",
      budget: selectedBudgetId || "",
      query: searchQuery,
    }).toString();

    navigate(`/results?${queryParams}`);
  };

  return (
    <div
      className="w-full sm:w-3/4 "
      style={{
        zIndex: "100",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: "25px",
        border: `1.2px solid ${theme.palette.secondary.light}`,
        padding: "1rem",
      }}
    >
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          {/* Search input */}
          <div className="relative flex items-center w-full mb-4 md:mb-0 md:w-3/4">
            <SearchOutlinedIcon
              className="absolute left-3"
              sx={{ color: theme.palette.primary.main, zIndex: "100" }}
            />
            <CustomTextField
              label="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* Region select */}
          <div className="relative flex items-center w-full mb-4 md:mb-0 md:w-2/3 lg:w-3/4">
            <MapOutlinedIcon
              className="absolute left-3"
              sx={{ color: theme.palette.primary.main, zIndex: 1 }}
            />
            <CustomSelect
              label="Región (opcional)"
              value={selectedRegionId}
              onChange={handleRegionChange}
              options={regions.map((r) => ({ label: r.region, value: r._id }))}
              labelStyle={{ color: "#000", paddingLeft: "2rem" }}
              selectStyle={{ paddingLeft: "1.5rem" }}
              style={{ width: "100%" }}
            />
          </div>
          
          {/* Prefecture select */}
          {selectedRegionId && (
            <div className="relative flex items-center w-full mb-4 md:mb-0">
              <PlaceOutlinedIcon
                className="absolute left-3"
                sx={{ color: theme.palette.primary.main, zIndex: 1 }}
              />
              <CustomSelect
                label="Prefecturas"
                value={selectedPrefectureId}
                onChange={(e) => setSelectedPrefectureId(e.target.value)}
                options={filteredPrefectures.map((p) => ({
                  label: p.name,
                  value: p._id,
                }))}
                disabled={!selectedRegionId}
                labelStyle={{ color: "#000", paddingLeft: "2rem" }}
                selectStyle={{ paddingLeft: "1.5rem" }}
                style={{ width: "100%" }}
              />
            </div>
          )}

          {/* Budget select */}
          <div className="relative flex items-center w-full mb-4 md:mb-0">
            <PlaceOutlinedIcon
              className="absolute left-3"
              sx={{ color: theme.palette.primary.main, zIndex: 1 }}
            />
            <CustomSelect
              label="Presupuesto"
              value={selectedBudgetId}
              onChange={(e) => setSelectedBudgetId(e.target.value)}
              options={budgets.map((b) => ({ label: b.name, value: b._id }))}
              labelStyle={{ color: "#000", paddingLeft: "2rem" }}
              selectStyle={{ paddingLeft: "1.5rem" }}
              style={{ width: "100%" }}
            />
          </div>

          {/* Search button */}
          <div className="w-full md:w-1/5 lg:w-1/6 md:ml-4 mb-4 md:mb-0">
            <button
              type="submit"
              style={{ backgroundColor: theme.palette.primary.main }}
              className="text-white rounded-full px-6 py-3 w-full md:w-auto"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBarHome;
