import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Chats from "./pages/chats";
import Chat from "./pages/chat";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chats" element={<Chats />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
