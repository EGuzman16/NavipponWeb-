import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { UserContextProvider } from "./context/UserContext";
import { FavoriteProvider } from "./context/FavoriteContext";


import store from "./store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <FavoriteProvider>
              <App />
          </FavoriteProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);