import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router";
export const AuthContext = React.createContext();
//custom hook that allows components to access context data
export function useAuth() {
  return useContext(AuthContext);
}
// sync -> if you have a user or not on login and logout
// It also exposes you lossley coupled auth functions
//
function AuthProvider({ children }) {
  // const history = useHistory();
  const [user, userSet] = useState("");
  const [loading, setLoading] = useState(false);
 
  async function signUp(name, password, email, confirm) {
    try {
      console.log("signup will be here");
      let res = await axios.post("/api/v1/auth/signup", {
        name: name,
        password: password,
        ConfirmPassword: confirm,
        email,
      });
      console.log("data", res.data);
    } catch (err) {
      console.log("err", err.message);
    }
  }

  async function login(email, password) {
    let flag = true;
    try {
      setLoading(true);
       const res = await axios.post("/api/v1/auth/login", {
        email: email,
        password: password,
      });
      
       if(res.status ==404){
             alert("user not found kindly signup");
            flag=false;
      } else if(res.status ==400){
         alert("Password or email may be wrong");
         flag = false;
      } else if(res.status == 500){
        alert("Internal server error")
         flag = false;
      } else{
       
            userSet(res.data.user);        
      }
      setLoading(false);
    // console.log("40",res.data);
       return flag;
    } catch (err) {
       console.log("ee", flag);
      console.log(err);
      setLoading(false);
    }
   
    console.log("login will be here");
  }
  function logout() {
    localStorage.removeItem("user")
    userSet(null);
    console.log("logout will come here");
  }

  const value = {
    user,
    login,
    signUp,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {/* if not loading show childrens  */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
