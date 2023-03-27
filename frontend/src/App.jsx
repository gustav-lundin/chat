import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Chats from "./pages/chats";
import Chat from "./pages/chat";
import { fetchJson } from "./fetch";
import { Container, Button, Nav, Navbar } from "react-bootstrap";
import Users from "./pages/users";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await fetchJson("login");
      if (!data.error) {
        setUser(data);
      }
    })();
  }, []);

  async function logOut() {
      await fetchJson("login", "DELETE");
      setUser(null);
      navigate("/");
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Chat</Navbar.Brand>
          <Nav className="me-auto">
            $
            {user ? (
              <>
                <Nav.Link href="/chats">Chats</Nav.Link>
                <Nav.Link href="/users">Users</Nav.Link>

                <Button
                  variant="light"
                  onClick={async () => {
                    await logOut();
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              ""
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container className="justify-content-center">
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            {user ? (
              <>
                <Route path="/" element={<Chats />} />
                <Route path="/chats/:chatId" element={<Chat />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/users" element={<Users />} />
              </>
            ) : (
              <>
                {" "}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </>
            )}
            <Route path="*" element={<h1>Not found</h1>} />
          </Routes>
        </UserContext.Provider>
      </Container>
    </>
  );
}

export default App;
