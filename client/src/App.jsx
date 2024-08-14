import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import AppContext from "./Context/AppContext";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import toast, { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";

function App() {
  const [user, setUser] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [peopleChattedWith, setPeopleChattedWith] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
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
      <Toaster />
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
