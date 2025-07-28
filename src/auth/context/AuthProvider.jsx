import React, { useReducer } from "react";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { types } from "../types/types";

//Inicializador
const init = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    logged: !!user,
    user: user,
  };
};
export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {}, init);

  //TODO: Agreagr el login y el pass como parametros y validar con el backend
  const login = (user) => {
    const action = {
      type: types.login,
      payload: user,
    };

    localStorage.setItem('user', JSON.stringify(user))
    dispatch(action);
  };

  const logout = () =>{
    localStorage.removeItem('user');
    const action = {type: types.logout};
    dispatch(action)
  }
  return (
    <AuthContext.Provider
      value={{
        //Atributos
        ...authState,
        //Metodos
        login: login,
        logout : logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
