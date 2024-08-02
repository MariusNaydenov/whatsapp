import { createContext } from "react";

const AppContext = createContext({
  user: null,
  setUser() {},
  message: "",
  setMessage() {},
  selectedPerson: null,
  setSelectedPerson() {},
  chat: [],
  setChat() {},
});

export default AppContext;
