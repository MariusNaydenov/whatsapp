import Input from "../../components/Input/Input";
import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const API = import.meta.env.VITE_URL_API;

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (response.ok) {
        toast.success("You've successfully registered.");
        setEmail("");
        setPassword("");
        setUsername("");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          gap: "10px",
          backgroundColor: "#f3f4f6",
        }}
      >
        <Box
          sx={{
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            border: "1px solid gray",
            width: "25%",
            height: "67%",
            borderRadius: "5%",
            minWidth: "400px",
            maxWidth: "500px",
          }}
        >
          <span
            style={{
              fontFamily: "Nunito,sans-serif",
              fontWeight: "bold",
              textAlign: "center",
              padding: "1.5%",
            }}
          >
            Sign up
          </span>
          <hr style={{ width: "100%" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "8%",
              gap: "4%",
              height: "15%",
              marginTop: "2%",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.4rem",
                fontFamily: "Nunito,sans-serif",
              }}
            >
              Welcome
            </span>

            <span
              style={{
                fontFamily: "Nunito, sans-serif",
                color: "#737373",
              }}
            >
              {" "}
              Create an account!
            </span>
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
              onSubmit={(e) => register(e)}
              action=""
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: "15px",
              }}
            >
              <Input
                type="text"
                label="Username"
                width="85%"
                className="input-text"
                value={username}
                setValue={setUsername}
              />
              <Input
                type="email"
                label="Email"
                width="85%"
                value={email}
                setValue={setEmail}
                className="input-text"
              />
              <Input
                type="password"
                label="Password"
                width="85%"
                value={password}
                setValue={setPassword}
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
                Already have an account?
              </span>
              <span
                className="hover:underline"
                style={{
                  color: "#000000",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                Log in
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignUp;
