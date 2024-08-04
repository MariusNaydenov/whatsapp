import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import { useEffect, useState } from "react";
import AppContext from "./Context/AppContext";
import Home from "./pages/Home/Home";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [peopleChattedWith, setPeopleChattedWith] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedPerson,
        setSelectedPerson,
        message,
        setMessage,
        chat,
        setChat,
        peopleChattedWith,
        setPeopleChattedWith,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={user ? <Home /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
