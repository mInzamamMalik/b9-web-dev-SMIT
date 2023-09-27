import React, { createContext, useReducer } from 'react'
import { reducer } from './reducer';
export const GlobalContext = createContext("Initial Value");




let data = {
  user: {}, // { firstName: "John", lastName: "Doe", email: "XXXXXXXXXXXXXX" }
  role: null, // null || "user" || "admin"
  isLogin: null, // null || true || false
  darkTheme: true
}



export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}
