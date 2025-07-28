import React, { useState } from "react";
import { AppRouter } from "./router/AppRouter";
import { AuthProvider } from "./auth";

export const ThemeContext = React.createContext(null);
export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};
