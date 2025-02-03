import config from "@config/config.js";

/* experiences */
export const fetchExperiences = async (token) => {
  try {
    const response = await fetch(`${config.API_URL}/experiences`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error data:", errorData);
      throw new Error(errorData.message || "Error al obtener Experiencias.");
    }

    const data = await response.json();
    console.log("Fetched experiences data:", data);
    return data;
  } catch (error) {
    console.error("Fetch experiences error:", error);
    throw error;
  }
};

export const fetchSearchedExperiences = async (
  token,
  { region, prefecture, budget, query }
) => {
  try {
    const params = new URLSearchParams();

    if (region) params.append("region", region);
    if (prefecture) params.append("prefecture", prefecture);
    if (budget) params.append("budget", budget);
    if (query) params.append("query", query);

    const response = await fetch(
      `${config.API_URL}/experiences/search-location?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener experiencias.");
    }

    const data = await response.json();
    console.log("Fetched experiences data:", data);

    return data;
  } catch (error) {
    console.error("Fetch searched experiences error:", error);
    throw error;
  }
};

export const saveOrUnsaveExperience = async (
  loggedInUserId,
  experienceId,
  isSaved,
  token
) => {
  const method = isSaved ? "DELETE" : "PATCH";
  const response = await fetch(
    `${config.API_URL}/users/${loggedInUserId}/favorites/experiences/${experienceId}`,
    {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update favorite experiences");
  }

  return await response.json();
};

export const deleteExperience = async (experienceId, token) => {
  const response = await fetch(
    `${config.API_URL}/experiences/${experienceId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete experience");
  }

  return await response.json();
};

/* fetch prefectures */
export const fetchPrefectures = async (token) => {
  const response = await fetch(`${config.API_URL}/prefectures`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch prefectures");
  }
  return await response.json();
};

/* fetch prefectures */
export const fetchBudgets = async (token) => {
  const response = await fetch(`${config.API_URL}/budget`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch budgets");
  }
  return await response.json();
};

/* fetch budgets */
export const fetchRegions = async (token) => {
  const response = await fetch(`${config.API_URL}/regions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch regions");
  }
  return await response.json();
};

export const fetchFavoriteExperiences = async (
  userId,
  token,
  prefectureMap,
  budgetMap
) => {
  const response = await fetch(
    `${config.API_URL}/users/${userId}/experiences`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response from server:", errorText);
    throw new Error("Failed to fetch favorite experiences");
  }

  const data = await response.json();
  return data.map((experience) => ({
    ...experience,
    prefecture: {
      name: prefectureMap[experience.prefecture] || "Unknown",
    },
    budget: {
      name: budgetMap[experience.budget] || "Unknown",
    },
    isSaved: true,
  }));
};

/* users  */
export const fetchUserPicture = async (token, postUserId) => {
  const response = await fetch(`${config.API_URL}/users/${postUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
};

/* fetch categories */
export const fetchCategoryDetails = async () => {
  const response = await fetch(`${config.API_URL}/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return await response.json();
};

/* fetch trips */
export const fetchTrips = async (token) => {
  const response = await fetch(`${config.API_URL}/trips`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch trips");
  }

  return await response.json();
};

/* delete trip */
export const deleteTrip = async (tripId, token) => {
  const response = await fetch(`${config.API_URL}/trips/${tripId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete trip");
  }

  return await response.json();
};

export const fetchExperienceDetails = async (experienceId, token) => {
  try {
    console.log("Fetching experience details for ID:", experienceId); // Log the correct ID
    const response = await fetch(
      `${config.API_URL}/experiences/${experienceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Response status:", response.status);
      const errorData = await response.json();
      console.log("Error data:", errorData);
      throw new Error(
        errorData.message || "Failed to fetch experience details"
      );
    }

    const data = await response.json();
    console.log("Fetched experience data:", data);
    return data;
  } catch (error) {
    console.error("Fetch experience details error:", error);
    throw error;
  }
};
