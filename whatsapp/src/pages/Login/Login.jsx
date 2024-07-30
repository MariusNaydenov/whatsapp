import { Box } from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
import AppContext from "..//../Context/AppContext";
import "./Login.css";
import Input from "../../components/Input/Input";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const { setUser, user } = useContext(AppContext);

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", JSON.stringify(data.token));
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        setUser(decoded);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box className="login-main">
        <Box className="login-title-box">
          <img
            src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=w240-h480-rw"
            alt="logo"
            style={{ borderRadius: "50%", width: "100px" }}
          />
          <span
            style={{
              color: "#25D366",
              fontFamily: "Nunito, sans-serif",
              fontSize: "2.7rem",
            }}
          >
            Whatsapp
          </span>
        </Box>

        <Box sx={{ boxShadow: 4 }} className="login-form">
          <span className="login-text">Login</span>
          <hr style={{ width: "100%" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "8%",
              gap: "4%",
              height: "15%",
              marginTop: "2%",
              marginBottom: "5%",
            }}
          >
            <span className="login-welcome">Welcome</span>
            <span className="login-log"> Login to your account!</span>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "60%",
              gap: "6%",
            }}
          >
            <form
              onSubmit={(e) => login(e)}
              action=""
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: "20px",
              }}
            >
              <Input
                type="email"
                label="Email"
                width="85%"
                value={emailValue}
                setValue={setEmailValue}
                className="input-text"
              />
              <Input
                type="password"
                label="Password"
                width="85%"
                value={password}
                setValue={setPasswordValue}
              />
              <input
                type="submit"
                style={{
                  backgroundColor: "#25D366",
                  width: "85%",
                  height: "45px",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontFamily: "Nunito,sans-serif",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                value="Continue"
              />
            </form>
            <Box
              sx={{
                display: "flex",
                fontFamily: "Nunito,sans-serif",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "5%",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#737373",
                  marginRight: "5px",
                }}
              >
                First time using whatsapp?
              </span>
              <span
                className="create-account-text"
                style={{ color: "#000000", fontSize: "0.9rem" }}
                onClick={() => navigate("/sign-up")}
              >
                Create an account
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
