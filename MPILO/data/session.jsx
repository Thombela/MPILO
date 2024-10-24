import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
   const [userData, setUserData] = useState({
    server: 'hex.uct.ac.za',
    username: '',
    password: '',
    port: 22,
    renderType: 'perspective',
    postProcessing: 'enabled'
   })
   const [projects, setProjects] = useState([])

  
   return (
     <UserDataContext.Provider value={{userData, setUserData, projects, setProjects}}>
       {children}
     </UserDataContext.Provider>
   )
}