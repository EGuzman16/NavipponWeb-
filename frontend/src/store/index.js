import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducers";

// Get user data from localStorage with safe parsing
let userInfoFromStorage = null;
const storedUserData = localStorage.getItem("account");

if (storedUserData) {
  try {
    userInfoFromStorage = JSON.parse(storedUserData);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    userInfoFromStorage = null; // Reset to null if parsing fails
  }
}

const initialState = {
  user: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: initialState,
});

export default store;
